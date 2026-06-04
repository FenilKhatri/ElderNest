import SlotLock from "./slotLock.model.js";

// Lock a slot for 10 minutes (600000 ms) while payment processes
// Uses upsert so the same user can retry without being blocked by their own lock
export const acquireSlotLock = async (caregiverId, bookingDate, startTime, endTime, userId) => {
    const date = new Date(bookingDate);
    date.setHours(0, 0, 0, 0);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    try {
        // Try to find an existing lock for this exact slot
        const existingLock = await SlotLock.findOne({
            caregiverId,
            bookingDate: date,
            startTime,
            endTime,
        });

        if (existingLock) {
            // If the lock belongs to the same user, extend it
            if (existingLock.userId.toString() === userId.toString()) {
                existingLock.expiresAt = expiresAt;
                await existingLock.save();
                return existingLock;
            }

            // If the lock belongs to someone else and hasn't expired, deny
            if (existingLock.expiresAt > new Date()) {
                return null; // Slot is locked by another user
            }

            // If the lock has expired, remove it and create a new one
            await SlotLock.deleteOne({ _id: existingLock._id });
        }

        // Create a new lock
        const lock = await SlotLock.create({
            caregiverId,
            bookingDate: date,
            startTime,
            endTime,
            userId,
            expiresAt
        });
        return lock;
    } catch (error) {
        // If unique constraint fails due to race condition, try once more
        if (error.code === 11000) {
            // Check if it's our own lock
            const ourLock = await SlotLock.findOne({
                caregiverId,
                bookingDate: date,
                startTime,
                endTime,
                userId,
            });
            if (ourLock) {
                ourLock.expiresAt = expiresAt;
                await ourLock.save();
                return ourLock;
            }
            return null; // Failed to acquire lock — someone else has it
        }
        throw error;
    }
};

export const releaseSlotLock = async (caregiverId, bookingDate, startTime, endTime) => {
    const date = new Date(bookingDate);
    date.setHours(0, 0, 0, 0);

    await SlotLock.deleteOne({
        caregiverId,
        bookingDate: date,
        startTime,
        endTime
    });
};

/**
 * Check if a slot is locked by someone OTHER than excludeUserId.
 * If excludeUserId is provided, their own lock is ignored.
 */
export const isSlotLocked = async (caregiverId, bookingDate, startTime, endTime, excludeUserId = null) => {
    const date = new Date(bookingDate);
    date.setHours(0, 0, 0, 0);

    const query = {
        caregiverId,
        bookingDate: date,
        startTime,
        endTime,
        expiresAt: { $gt: new Date() }
    };

    // Exclude the current user's own lock
    if (excludeUserId) {
        query.userId = { $ne: excludeUserId };
    }

    const lock = await SlotLock.findOne(query);
    return !!lock;
};
