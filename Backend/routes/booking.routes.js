import express from "express";

const bookingRoutes = express.Router();

bookingRoutes.post("/booking", bookingController);

export default bookingRoutes;