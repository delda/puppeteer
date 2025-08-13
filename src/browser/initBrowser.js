import { setConfiguration } from './setConfiguration.js';
import { cookieBar } from './cookieBar.js';
import { loginPage } from './login.js';
import 'dotenv/config';
import { doLog } from '../utils/logUtils.js';
import { screenshot } from '../utils/screenshotUtils.js';
import {checkPreviousSession, saveCookies, setCookies} from "../utils/session.js";
import {cleanDirectory} from "../utils/fileUtils.js";

export const initBrowser = async (browser) => {
    const page = (await browser.pages())[0];
    await setConfiguration(page);
    const url = await setCookies(page);
    doLog();
    doLog('## Open Web Site');
    try {
        await page.goto(url);
    } catch (error) {
        doLog(`Error navigating to ${url}`, 'error');
        doLog(error.message, 'error');
        process.exit(1);
    }
    await screenshot(page, 'initBrowser');
    // Check if session is ok
    const loginArea = await page.$('#inputLoginname');
    if (loginArea) {
        doLog('  - Session not valid: reset of session!');
        cleanDirectory('cookies');
        const cookies = await page.cookies();
        await page.deleteCookie(...cookies);
        await page.goto(process.env.website);
    }
    if (!checkPreviousSession()) {
        await cookieBar(page);
        await loginPage(page);
        await page.waitForNavigation();
    }
    doLog();
    doLog('## Home page');
    await screenshot(page, 'home_page');
    await saveCookies(page);
    return page;
};

