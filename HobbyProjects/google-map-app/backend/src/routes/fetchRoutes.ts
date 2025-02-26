import { Router } from "express";
import { Container } from "typedi";
import { FileController } from "../controllers/fileController";

const router = Router();
const fileController = Container.get(FileController);

router.get("/", (req, res) => fileController.readJsonFile(req, res));


export default router;
