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

// cors
const allowedOrigin = [
    "http://localhost:5173",
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
// Handle preflight fetch
app.options(/.*/, cors()); 
app.use(express.urlencoded({ extended: true }));

// Disable caching
app.set("etag", false);
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});

app.use(helmet());
app.use((req, res, next) => {
    if (req.method === "OPTIONS") return res.sendStatus(200);;
    limiter(req, res, next);
});

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
    res.status(200).json({
        ok: true,
        message: "Server is running!",
    });
});

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