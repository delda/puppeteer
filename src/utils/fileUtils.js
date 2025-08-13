import fs from 'fs';
import { join } from 'path';

export const cleanDirectory = (directory) => {
    fs.rmSync(directory, {recursive: true, force: true,})
    fs.mkdirSync(directory);
}

export const checkConfig = (jsonString) => {
    const config = JSON.parse(jsonString);
    const requiredProps = ["auctionPercent", "age", "skills", "price"];
    for (let prop of requiredProps) {
        if (!(prop in config)) {
            return false;
        }
    }
    return true;
}

export const registerTransferNumber = (number) => {
    const filePath = join(process.cwd(), 'transferNumber.json');
    let data = [];
    if (fs.existsSync(filePath)) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) {
                data = parsed;
            }
        } catch {
        }
    }
    const out = {
        date: new Date().toISOString(),
        number,
    };
    data.push(out);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
