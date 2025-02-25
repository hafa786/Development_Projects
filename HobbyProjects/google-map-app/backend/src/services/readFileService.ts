import { Service } from "typedi";
import { promises as fs } from 'fs';
import { MapData } from "../types/map-data";
import { readFileSync } from 'fs';
import * as path from 'path';

@Service()
export class ReadFileService {
    private folderPath: string = path.resolve(__dirname, '../../', 'uploads');
    async readJsonFile(): Promise<any> {
        const latestFile = await this.getLatestFile(this.folderPath)
        if (latestFile) {
            return readFileSync(path.resolve(`${this.folderPath}/${latestFile}`), 'utf-8');
        }
        return null;
    }

    // get the latest uploaded json file
    async getLatestFile(folderPath: string): Promise<string | null> {
        try {
            const files = await fs.readdir(folderPath);
            if (files.length === 0) return null;

            const fileStats = await Promise.all(
                files.map(async (file) => ({
                    file,
                    stats: await fs.stat(path.join(folderPath, file)),
                }))
            );

            const latestFile = fileStats
                .filter(({ stats }) => stats.isFile()) // Filter only files
                .sort((a, b) => b.stats.mtimeMs - a.stats.mtimeMs)[0]; // Sort by modified time

            return latestFile ? latestFile.file : null;
        } catch (error) {
            console.error('Error reading folder:', error);
            return null;
        }
    }
}
