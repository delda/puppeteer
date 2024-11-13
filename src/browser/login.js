import { doLog } from '../utils/logUtils.js';
import { screenshot } from '../utils/screenshotUtils.js';
import { cookieBar } from "./cookieBar.js";
import 'dotenv/config';
import { waitRandomTime } from "../utils/timeUtils.js";

export const loginPage = async (page) => {
    doLog('  - Click on login page');
    await screenshot(page, 'start');
    await waitRandomTime();
    await page.click('#divNewUserSignupLink > a');
    doLog();
    doLog('## Login page');
    let username = process.env.username;
    let password = process.env.password;
    if (!username || !password) {
        doLog('===> Username or password not found!');
        await process.exit(1);
    }
    doLog('  - Fill username: ' + username);
    await page.type('#ctl00_CPContent_ucLogin_txtUserName', username);
    doLog('  - Fill password: ' + '*'.repeat(password.length));
    await page.type('#ctl00_CPContent_ucLogin_txtPassword', password);
    doLog('  - Click login button');
    await page.waitForSelector('#divLoginBox .loginButton');
    const loginButton = await page.$('#divLoginBox .loginButton');
    await screenshot(page, 'login');
    await cookieBar(page);
    await waitRandomTime();
    await loginButton.click();
}
