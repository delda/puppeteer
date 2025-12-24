const fs = require('fs');
const path = require('path');

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
