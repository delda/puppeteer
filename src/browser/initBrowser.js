import { setConfiguration } from './setConfiguration.js';
import { cookieBar } from './cookieBar.js';
import { loginPage } from './login.js';
import 'dotenv/config';
import { doLog } from '../utils/logUtils.js';
import { screenshot } from '../utils/screenshotUtils.js';
import {checkPreviousSession, saveCookies, setCookies} from "../utils/session.js";

export const initBrowser = async (browser) => {
    const page = (await browser.pages())[0];
    await setConfiguration(page);
    const url = await setCookies(page);
    doLog();
    doLog('## Open Web Site');
    await page.goto(url);
    await screenshot(page, 'initBrowser');
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

