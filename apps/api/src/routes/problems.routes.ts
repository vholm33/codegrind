import express from "express";
import { createProblemHandler, deleteProblemHandler, updateProblemHandler } from "../controllers/problems.controllers.js";

const router = express.Router();

//Endpoint för att skapa problem
router.post("/problems", createProblemHandler);
router.put("/problems/:id", updateProblemHandler);
router.delete("/problems/:id", deleteProblemHandler);

export default router;