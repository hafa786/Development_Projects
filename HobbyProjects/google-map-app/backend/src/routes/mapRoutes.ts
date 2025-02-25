import { Router } from "express";
import { Container } from "typedi";
import { MapController } from "../controllers/mapController";

const router = Router();
const mapController = Container.get(MapController);

router.post("/", mapController.singleFileUploadMiddleware(), (req, res) => mapController.uploadSingleFile(req, res));

export default router;
