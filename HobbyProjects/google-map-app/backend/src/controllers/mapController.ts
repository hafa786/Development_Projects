import { Request, Response } from "express";
import { Service } from "typedi";
import { MapService } from "../services/mapService";
import multer from '../middleware/multer';

@Service()
export class MapController {
    constructor(private mapService: MapService) { }

    public uploadSingleFile(req: Request, res: Response): void {
        //try {
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

        // } catch (e) {
        //     res.status(200).json({
        //         message: e
        //     })
        // }

    }

    // Multer middleware for single file upload (to be used in routes)
    public singleFileUploadMiddleware() {
        return multer.single('file');
    }

    uploadMapFile = (req: Request, res: Response) => {
        console.log(req.file)
        // const storage = multer.diskStorage({
        //     destination: (req, file, cb) => {
        //         cb(null, 'uploads/'); // Files will be saved in the 'uploads' directory
        //     },
        //     filename: (req, file, cb) => {
        //         cb(null, `${Date.now()}-${file.originalname}`);
        //     }
        // });
        // // validate the file is json type
        // const upload = multer({
        //     storage,
        //     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
        //     fileFilter: (req, file, cb) => {
        //         if (file.mimetype === 'application/json') {
        //             cb(null, true); // accept it
        //             console.log('Temp directory:', os.tmpdir());
        //             res.json(os.tmpdir());
        //         } else {
        //             cb(new Error('Only file with json format is allowed!'));
        //             res.json('Only file with json format is allowed!')
        //         }
        //     }
        // });
        // upload.single('file')
    };

    convertMapTemperature = (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const user = this.mapService.getConvertedTemprature(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    };
}
