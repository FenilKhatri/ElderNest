import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "../modules/service/service.model.js";
import Booking from "../modules/booking/booking.model.js";

dotenv.config();

const migrate = async () => {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully.");

        // 1. Remove price and duration from Services
        console.log("Migrating Services...");
        const serviceUpdateResult = await Service.updateMany(
            {},
            { $unset: { price: "", duration: "" } }
        );
        console.log(`Updated ${serviceUpdateResult.modifiedCount} services.`);

        // 2. Migrate Bookings
        console.log("Migrating Bookings...");
        const bookings = await Booking.find({ careType: { $exists: true } });
        console.log(`Found ${bookings.length} bookings to migrate.`);

        let migratedCount = 0;
        for (const booking of bookings) {
            let serviceType = "hourly";
            let billingType = "hourly";
            let quantity = 1;

            if (booking.careType === "part-time" || booking.careType === "full-time") {
                serviceType = booking.careType;
                billingType = "daily";
            } else if (booking.careType === "live-in") {
                serviceType = "live-in";
                billingType = "monthly";
            } else if (booking.careType === "emergency") {
                serviceType = "emergency";
                billingType = "hourly";
            } else {
                serviceType = "hourly";
                billingType = "hourly";
            }

            // Estimate quantity based on old duration if possible
            if (booking.duration) {
                quantity = booking.duration;
            }

            // Estimate unit rate based on old amount
            let unitRate = 0;
            if (booking.totalAmount > 0 && quantity > 0) {
                unitRate = booking.totalAmount / quantity;
            }

            // Update booking document
            await Booking.updateOne(
                { _id: booking._id },
                {
                    $set: {
                        serviceType,
                        billingType,
                        quantity,
                        unitRate
                    },
                    $unset: {
                        careType: "",
                        duration: "",
                        durationType: ""
                    }
                },
                { strict: false } // To allow $unset of removed fields in schema
            );
            migratedCount++;
        }
        console.log(`Migrated ${migratedCount} bookings.`);

        console.log("Migration complete!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrate();
