import express from "express";

const caregiverRoutes = express.Router();

caregiverRoutes.post("/caregiver", caregiverController);

export default caregiverRoutes;