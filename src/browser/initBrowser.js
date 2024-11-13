import { setConfiguration } from './setConfiguration.js';
import { cookieBar } from './cookieBar.js';
import { loginPage } from './login.js';
import 'dotenv/config';
import { doLog } from '../utils/logUtils.js';
import { screenshot } from '../utils/screenshotUtils.js';

export const initBrowser = async (browser) => {
    let url = process.env.website;
    // url = 'https://www.hattrick.org';
    const page = (await browser.pages())[0];
    await setConfiguration(page);
    doLog();
    doLog('## Hattrick Web Site');
    await page.goto(url, { waitUntil: 'domcontentloaded' }).catch(err => doLog(`error loading url: ${err.message}`));
    await screenshot(page, 'initBrowser');
    await cookieBar(page);
    await loginPage(page);
    doLog();
    doLog('## Home page');
    await page.waitForNavigation();
    await screenshot(page, 'home_page');
    return page;
};

