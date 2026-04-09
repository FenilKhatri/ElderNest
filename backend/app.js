import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dns from "dns";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { limiter } from "./helpers/rate.limiter.js";

const app = express();

dns.setServers(['8.8.8.8', '8.8.4.4']);

app.use(express.json());
app.use(cookieParser());

app.use(helmet());
app.use(limiter);

// cors
const allowedOrgin = ["http://localhost:5173"]
app.use(cors({
    origin: allowedOrgin,
    credentials: true,
}))

// Routes
app.use("/api/auth", authRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export default app;