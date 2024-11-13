import fs from 'fs';

export const cleanDirectory = (directory) => {
    fs.rmSync(directory, {recursive: true, force: true,})
    fs.mkdirSync(directory);
}

