import { Request, Response } from "express";
import { Service } from "typedi";
import { ReadFileService } from "../services/readFileService";
import { throws } from "assert";

@Service()
export class ReadFileController {
    constructor(private readFileService: ReadFileService) { }

    public async readJsonFile(req: Request, res: Response) {
        try {
            const mapData = await this.readFileService.readJsonFile();
            res.status(200).json(JSON.parse(mapData));
        } catch (e) {
            res.status(500).json(e);
        }
    }
}
