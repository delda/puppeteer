import {doLog} from '../utils/logUtils.js';
import {screenshot} from "../utils/screenshotUtils.js";

export const navigateToUrl = async (page, url, options = {}) => {
    try {
        const response = await page.goto(url, options);
        await screenshot(page, 'navigateToUrl');
        if (!response || response.status() !== 200) {
            doLog(`Error navigating to ${url}`, 'error');
            doLog('Status code: ' +  response.status(), 'error');
            process.exit(1);
        }
    } catch (error) {
        doLog(`Error navigating to ${url}`, 'error');
        doLog(error.message, 'error');
        process.exit(1);
    }
};
