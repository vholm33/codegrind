import express from "express";
import { createProblemHandler } from "../controllers/problems.controllers.js";

const router = express.Router();

//Endpoint för att skapa problem
router.post("/problems", createProblemHandler);

export default router;