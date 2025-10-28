import fs from 'fs';
import {doLog} from "./logUtils.js";
import {screenshot} from "./screenshotUtils.js";
import {waitRandomTime} from "./timeUtils.js";
import {fromTransferListToTextualLevel} from "../player/playerSearch.js";
import {join} from "path";
import {cookieBar} from "../browser/cookieBar.js";

export const registerTransferNumber = (number, week, season) => {
    const filePath = join(process.cwd(), 'transfer/transferNumber.json');
    let data = [];
    if (fs.existsSync(filePath)) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) {
                data = parsed;
            }
        } catch {
        }
    }
    const out = {
        date: new Date().toISOString(),
        number,
        week,
        season
    };
    data.push(out);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export const saveTransferInfo = async (page) => {
    doLog();
    doLog('## League page');
    const link = await page.$('#teamLinks > a:nth-child(3)');
    link.click();
    await waitRandomTime();
    await screenshot(page, 'team_link');

    doLog('* Extract the season');
    const season = await page.$eval('#ctl00_ctl00_CPContent_CPMain_UpdatePanelLiveLeagueTable .flex-grow', el => {
        const match = /stagione\s+(\d+)/.exec(el.textContent);
        return match ? parseInt(match[1], 10) : null;
    });

    doLog('* Extract the week');
    const week = await page.$eval('#online', el => {
        const match = /settimana\s*(\d+)/i.exec(el.textContent);
        return match ? parseInt(match[1], 10) : null;
    });

    doLog('  - Click on transfer page');
    const transferButton = await page.$('.scTransfer');
    await cookieBar(page);
    await waitRandomTime();
    await screenshot(page, 'transfer_button');
    if (!transferButton) {
        doLog('  - Error in page: no transfer button found!');
        return null;
    }

    await transferButton.click();
    doLog();
    doLog('## Search page');
    await page.waitForNavigation();
    await screenshot(page, 'search_page');
    doLog('* Extract the number of players in transfer list')
    const transferPlayersNumber = await page.evaluate(() => {
        const nodoTesto = document.evaluate(
            "//td[contains(., 'Giocatori in lista di trasferimento')]",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        if (!nodoTesto) return null;
        const nextTd = nodoTesto.nextElementSibling;
        const regex = /\s+/;
        return nextTd ? parseInt(nextTd.textContent.trim().replace(regex, '')) : null;
    });
    const transferPlayersLevel = fromTransferListToTextualLevel(transferPlayersNumber);
    doLog('  - Season ' + season + ', week ' + week);
    doLog('  - Player in transfer list: ' + transferPlayersNumber + ' (' + transferPlayersLevel + ')');
    registerTransferNumber(transferPlayersNumber, week, season);
}
