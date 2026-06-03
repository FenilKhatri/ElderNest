import CaregiverAvailability from "../../modules/caregiver/caregiverAvailability.model.js";
import Booking from "../../modules/booking/booking.model.js";

/**
 * Convert "HH:MM" to total minutes since midnight.
 */
const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
};

/**
 * Convert total minutes back to "HH:MM" string.
 */
const fromMinutes = (mins) => {
    const h = String(Math.floor(mins / 60)).padStart(2, "0");
    const m = String(mins % 60).padStart(2, "0");
    return `${h}:${m}`;
};

/**
 * Generate all available booking slots for a given caregiver on a given date.
 *
 * Steps:
 * 1. Determine the day-of-week from the date.
 * 2. Fetch all CaregiverAvailability blocks for that caregiver + day.
 * 3. For each block, generate sub-slots based on slotDuration.
 * 4. Remove slots that overlap with existing bookings (pending/accepted/in-progress).
 * 5. Return the remaining available slots.
 *
 * @param {string} caregiverId - Caregiver document _id
 * @param {Date|string} date     - The booking date (YYYY-MM-DD or Date object)
 * @returns {Array<{startTime: string, endTime: string, duration: number}>}
 */
export const generateAvailableSlots = async (caregiverId, date) => {
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    const dayOfWeek = dateObj.getDay(); // 0=Sun … 6=Sat

    // 1. Fetch availability blocks for this day
    const blocks = await CaregiverAvailability.find({
        caregiverId,
        dayOfWeek,
        isActive: true,
    }).sort({ startTime: 1 });

    if (!blocks.length) return [];

    // 2. Fetch existing bookings for this date
    const nextDay = new Date(dateObj);
    nextDay.setDate(nextDay.getDate() + 1);

    const existingBookings = await Booking.find({
        caregiverId,
        bookingDate: { $gte: dateObj, $lt: nextDay },
        status: { $in: ["pending", "accepted", "in-progress"] },
    }).select("timeSlot");

    // Convert existing bookings to minute ranges for fast overlap checks
    const bookedRanges = existingBookings.map((b) => ({
        start: toMinutes(b.timeSlot.startTime),
        end: toMinutes(b.timeSlot.endTime),
    }));

    // 3. Generate sub-slots from each block
    const allSlots = [];

    for (const block of blocks) {
        const blockStart = toMinutes(block.startTime);
        const blockEnd = toMinutes(block.endTime);
        const duration = block.slotDuration;

        for (let cursor = blockStart; cursor + duration <= blockEnd; cursor += duration) {
            const slotStart = cursor;
            const slotEnd = cursor + duration;

            // 4. Check overlap with any existing booking
            const overlaps = bookedRanges.some(
                (br) => slotStart < br.end && slotEnd > br.start
            );

            allSlots.push({
                startTime: fromMinutes(slotStart),
                endTime: fromMinutes(slotEnd),
                duration,
                available: !overlaps,
            });
        }
    }

    return allSlots;
};

/**
 * Verify that a specific time-slot falls within the caregiver's availability
 * and doesn't overlap with existing bookings.
 *
 * @returns {boolean}
 */
export const isSlotAvailable = async (caregiverId, date, startTime, endTime) => {
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    const dayOfWeek = dateObj.getDay();

    const startMins = toMinutes(startTime);
    const endMins = toMinutes(endTime);

    // Check if slot falls within any availability block
    const blocks = await CaregiverAvailability.find({
        caregiverId,
        dayOfWeek,
        isActive: true,
    });

    const fitsBlock = blocks.some((b) => {
        const bStart = toMinutes(b.startTime);
        const bEnd = toMinutes(b.endTime);
        return startMins >= bStart && endMins <= bEnd;
    });

    if (!fitsBlock) return false;

    // Check for booking overlaps
    const nextDay = new Date(dateObj);
    nextDay.setDate(nextDay.getDate() + 1);

    const overlap = await Booking.findOne({
        caregiverId,
        bookingDate: { $gte: dateObj, $lt: nextDay },
        status: { $in: ["pending", "accepted", "in-progress"] },
        "timeSlot.startTime": { $lt: endTime },
        "timeSlot.endTime": { $gt: startTime },
    });

    return !overlap;
};
