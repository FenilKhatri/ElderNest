import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", async () => {
    try {
        await connectDB();
        console.log(`Server running on port ${PORT}`);
    } catch (err) {
        console.error("DB connection failed:", err);
    }
});