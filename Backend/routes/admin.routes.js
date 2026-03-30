import express from "express";

const adminRoutes = express.Router();

adminRoutes.post("/admin", adminController);

export default adminRoutes;