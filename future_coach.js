import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { initBrowser } from './src/browser/initBrowser.js';
import { saveTransferInfo } from './src/utils/statistics.js';
import { doLog } from './src/utils/logUtils.js';

const main = async () => {
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--start-maximized'],
        defaultViewport: null
    });
    try {
        const page = await initBrowser(browser);
        await saveTransferInfo(page);
        doLog('Execution completed successfully.');
    } catch (err) {
        console.error('Error during execution:', err);
    } finally {
        await browser.close();
    }
};

await main();
