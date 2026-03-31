import express from "express";

const service = express.Router();

service.post("/users", serviceController);

export default service;