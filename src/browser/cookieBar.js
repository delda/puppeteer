import {doLog} from '../utils/logUtils.js';
import {waitRandomTime} from "../utils/timeUtils.js";

export const cookieBar = async (page) => {
    doLog('  - Check cookie bar');
    const banner = await page.waitForSelector('button.cky-btn.cky-btn-accept');
    await waitRandomTime();
    await banner.evaluate(el => el.click());
}


