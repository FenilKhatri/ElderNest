import SlotLock from "./slotLock.model.js";

// Lock a slot for 10 minutes (600000 ms) while payment processes
export const acquireSlotLock = async (caregiverId, bookingDate, startTime, endTime, userId) => {
    const date = new Date(bookingDate);
    date.setHours(0, 0, 0, 0);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    try {
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
        // If unique constraint fails, it means it's already locked
        if (error.code === 11000) {
            return null; // Failed to acquire lock
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

export const isSlotLocked = async (caregiverId, bookingDate, startTime, endTime) => {
    const date = new Date(bookingDate);
    date.setHours(0, 0, 0, 0);

    const lock = await SlotLock.findOne({
        caregiverId,
        bookingDate: date,
        startTime,
        endTime,
        expiresAt: { $gt: new Date() }
    });

    return !!lock;
};
