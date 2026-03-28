import express from "express";

const userRoutes = express.Router();

userRoutes.post("/users", userController);

export default userRoutes;