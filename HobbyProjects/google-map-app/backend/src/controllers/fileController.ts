import { Request, Response } from "express";
import { Service } from "typedi";
import multer from '../middleware/multer';
import { FileService } from "../services/fileService";

@Service()
export class FileController {
    constructor(private fileService: FileService) { }

    public async readJsonFile(req: Request, res: Response) {
        try {
            const mapData = await this.fileService.readJsonFile();
            res.status(200).json(JSON.parse(mapData));
        } catch (e) {
            // need to cover all possible error case
            res.status(500).json(e);
        }
    }

    // Multer middleware for single file upload (to be used in routes)
    public singleFileUploadMiddleware() {
        return multer.single('file');
    }

    public uploadSingleFile(req: Request, res: Response): void {
        try {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded.' });
                return;
            }

            const fileName = req.file.filename;
            const filePath = req.file.path;
            res.status(200).json({
                message: 'File uploaded successfully!',
                fileName,
                filePath,
            });

        } catch (e) {
            // need to handle all possible error case
            res.status(500).json({
                message: e
            })
        }

    }
}
