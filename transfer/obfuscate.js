import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, 'transferNumber.json');
const outputFile = path.join(__dirname, 'transferNumber.dat');

try {
    const data = fs.readFileSync(inputFile);
    const encoded = data.toString('base64');
    fs.writeFileSync(outputFile, encoded);
    console.log(`Successfully obfuscated ${inputFile} to ${outputFile}`);
} catch (err) {
    console.error('Error obfuscating file:', err);
    process.exit(1);
}
