import { writeFileSync } from 'fs';

const replacer = (_: unknown, value: unknown) => {
    if (typeof value === 'string') {
        // LSEP, NBSP
        return value.replace(/[\u2028\u00a0]/g, ' ');
    }

    return value;
};

export const writeJSON = (filePath: string, data: unknown): void => {
    try {
        const json = JSON.stringify(data, replacer, 2);
        writeFileSync(filePath, json);
    } catch (error) {
        console.error(`Failed to write JSON to ${filePath}:`, error);
        throw error;
    }
};
