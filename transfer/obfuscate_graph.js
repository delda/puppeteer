import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JavaScriptObfuscator from 'javascript-obfuscator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFile = path.join(__dirname, 'transferNumber.json');
const inputFile = path.join(__dirname, 'transfer_graph.js');
const outputFile = path.join(__dirname, 'transfer_graph.min.js');

try {
    console.log(`Reading data from ${dataFile}...`);
    const jsonData = fs.readFileSync(dataFile);
    const base64Data = jsonData.toString('base64');

    console.log(`Reading code from ${inputFile}...`);
    let code = fs.readFileSync(inputFile, 'utf8');

    console.log(`Embedding data into ${inputFile}...`);
    // Regular expression to find "const encodedData = "...";" and replace the value
    const encodedDataRegex = /const\s+encodedData\s*=\s*".*?";/s;
    const newEncodedDataLine = `const encodedData = "${base64Data}";`;

    if (encodedDataRegex.test(code)) {
        code = code.replace(encodedDataRegex, newEncodedDataLine);
        // Write the updated file back to the source file
        fs.writeFileSync(inputFile, code);
        console.log(`Successfully updated ${inputFile} with new data.`);
    } else {
        console.warn('Warning: Could not find encodedData variable in transfer_graph.js. Skipping embedding.');
    }

    console.log('Obfuscating code...');
    const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 1,
        debugProtection: false,
        disableConsoleOutput: false,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: true,
        renameGlobals: true,
        selfDefending: true,
        simplify: true,
        splitStrings: true,
        splitStringsChunkLength: 5,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayCallsTransformThreshold: 1,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 1,
        unicodeEscapeSequence: false
    });

    console.log(`Writing obfuscated code to ${outputFile}...`);
    fs.writeFileSync(outputFile, obfuscationResult.getObfuscatedCode());
    console.log('Successfully obfuscated transfer_graph.js');
} catch (err) {
    console.error('Error during processing:', err);
    process.exit(1);
}
