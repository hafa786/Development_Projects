import { Router } from "express";
import { Container } from "typedi";
import { FileController } from "../controllers/fileController";

const router = Router();
const fileController = Container.get(FileController);

router.post("/", fileController.singleFileUploadMiddleware(), (req, res) => fileController.uploadSingleFile(req, res));

export default router;
