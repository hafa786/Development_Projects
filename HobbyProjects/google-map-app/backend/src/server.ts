import "reflect-metadata";

import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mapRoutes from "./routes/mapRoutes";
import readFileRoutes from './routes/readFileRoutes'
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("Hello, TypeScript Node.js Server!");
});
app.use("/api/upload", mapRoutes);
app.use("/api/fetch", readFileRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
