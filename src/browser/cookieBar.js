import { doLog } from '../utils/logUtils.js';
import { waitRandomTime } from "../utils/timeUtils.js";

export const cookieBar = async (page) => {
    doLog('  - Check cookie bar');
    try {
        const banner = await page.waitForSelector('button.cky-btn.cky-btn-accept', { timeout: 5000 });
        if (banner) {
            await waitRandomTime();
            await banner.evaluate(el => el.click());
            doLog('    - Cookie bar accepted');
        }
    } catch (error) {
        doLog('    - Cookie bar not found or already accepted');
    }
}


