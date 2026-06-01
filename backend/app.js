import express from "express";
import dns from "dns";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";
import { apiLimiter } from "./common/middlewares/limiter.js";

const app = express();
dns.setServers(['8.8.8.8', '8.8.4.4']);

app.use(express.json());
app.use(cookieParser());

// CORS
const allowedOrigin = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://elder-nest-care.vercel.app",
];

app.use(
    cors({
        origin: allowedOrigin,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.urlencoded({ extended: true }));

// Disable caching
app.set("etag", false);
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});

app.use(helmet());
app.use(apiLimiter);

app.use("/api", routes);

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        ok: true,
        message: "Server is running!",
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("ERROR:", err);

    const statusCode = err.statusCode || 500;

    if (err.isOperational) {
        return res.status(statusCode).json({
            success: false,
            message: err.message,
        });
    }

    return res.status(500).json({
        success: false,
        message: "Something went wrong",
    });
});

export default app;