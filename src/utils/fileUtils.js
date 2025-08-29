import fs from 'fs';
import { join } from 'path';

export const cleanDirectory = (directory) => {
    fs.rmSync(directory, {recursive: true, force: true,})
    fs.mkdirSync(directory);
}

export const checkConfig = (jsonString) => {
	let config;
	try {
		config = JSON.parse(jsonString);
	} catch {
		return false;
	}
	const requiredProps = ["auctionPercent", "age", "skills", "price"];
	const hasRequiredProps = (obj) =>
		requiredProps.every((prop) => Object.prototype.hasOwnProperty.call(obj, prop));
	if (Array.isArray(config)) {
		return config.length > 0 && config.every(
			(item) => item && typeof item === "object" && hasRequiredProps(item)
		);
	}
	if (config && typeof config === "object") {
		return hasRequiredProps(config);
	}
	return false;
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
