import { setConfiguration } from './setConfiguration.js';
import { cookieBar } from './cookieBar.js';
import { loginPage } from './login.js';
import 'dotenv/config';
import { doLog } from '../utils/logUtils.js';
import { screenshot } from '../utils/screenshotUtils.js';
import {checkPreviousSession, saveCookies, setCookies, checkIsInSession} from "../utils/session.js";
import {cleanDirectory} from "../utils/fileUtils.js";
import {navigateToUrl} from "./navigation.js";

export const initBrowser = async (browser) => {
    const page = (await browser.pages())[0];
    await setConfiguration(page);
    const url = await setCookies(page);
    doLog();
    doLog('## Open Web Site');
    await navigateToUrl(page, url);
    const isInSession = await checkIsInSession(page);
    if (!isInSession) {
        doLog('  - Not in session: cleaning old datas');
        cleanDirectory('cookies');
        const cookies = await page.cookies();
        await page.deleteCookie(...cookies);
        await navigateToUrl(page, process.env.website);
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
