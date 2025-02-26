import { Router } from "express";
import { Container } from "typedi";
import { ReadFileController } from "../controllers/readFileController";

const router = Router();
const readFileController = Container.get(ReadFileController);

router.get("/", (req, res) => readFileController.readJsonFile(req, res));

export default router;
