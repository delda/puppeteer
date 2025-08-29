import {doLog} from '../utils/logUtils.js';
import {screenshot} from "../utils/screenshotUtils.js";
import {waitRandomTime} from "../utils/timeUtils.js";

export const navigateToUrl = async (page, url, options = {waitUntil: 'domcontentloaded'}) => {
    let counter = 0;
    while (counter < 3) {
        counter = counter + 1;
        try {
            const response = await page.goto(url, options);
            await screenshot(page, 'navigateToUrl');
            if (!response || response.status() !== 200) {
                doLog(`Error navigating to ${url}`, 'error');
                doLog('Status code: ' +  response.status(), 'error');
                process.exit(1);
            }
            counter = 3;
        } catch (error) {
            if (error.message && error.message.includes('Navigation timeout')) {
                doLog(`Navigation timeout loading ${url}, retrying...`, 'warn');
                continue;
            }
            doLog(`Error loading url ${url}`, 'error');
            doLog(error.message, 'error');
            process.exit(1);
        }
    }
    await waitRandomTime();
};
