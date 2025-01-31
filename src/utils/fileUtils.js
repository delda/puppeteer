import fs from 'fs';

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
