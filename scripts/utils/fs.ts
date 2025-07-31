import { writeFileSync } from 'fs';

export const writeJSON = (filePath: string, data: unknown): void => {
    try {
        const json = JSON.stringify(data, null, 2);
        writeFileSync(filePath, json);
    } catch (error) {
        console.error(`Failed to write JSON to ${filePath}:`, error);
        throw error;
    }
};
