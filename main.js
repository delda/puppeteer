import puppeteer from 'puppeteer';
import {cleanDirectory} from './src/utils/fileUtils.js';
import {initBrowser} from './src/browser/initBrowser.js';
import {findAuctionInProgress, checkRelaunchProposal} from './src/player/auctionUtils.js';
import {searchNewPlayer} from './src/player/playerSearch.js';
import {doLog} from './src/utils/logUtils.js';
import {waitTime} from "./src/utils/timeUtils.js";
import {STATUS} from "./src/browser/setConfiguration.js";

const main = async () => {
    const config = '{"age":{"min":21, "max":27}, "skills":[{"type":6, "min":7, "max":9}], "price":{"minPrice":50000,"maxPrice":200000}}';
    const configJson = JSON.parse(config);

    cleanDirectory('img');

    let restart = true;
    let player = null;
    let playerLost = true;
    while (restart) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await initBrowser(browser);
        const followedPlayer = await findAuctionInProgress(browser, page);
        if (followedPlayer && !playerLost) {
            player = followedPlayer;
        }
        if (!player) {
            player = await searchNewPlayer(browser, page, configJson);
        }
        if (!player) {
            doLog('- No player found!');
            return;
        }
        const status = await checkRelaunchProposal(browser, player);
        doLog();
        switch (status) {
            case STATUS.LOST:
                doLog('Player lost!')
                player = null;
                playerLost = true;
                break;
            case STATUS.PENDING:
                const endDate = player.date;
                const currentDate = new Date();
                const secondsToReload = parseInt((endDate.getTime() - currentDate.getTime()) / 1000) - 60 * 60;
                const timeToReload = new Date(currentDate.getTime() + secondsToReload * 1000);
                doLog('- Wait ' + secondsToReload.toDate() + ' (' + timeToReload.toLocaleString('it-IT', {year: 'numeric', month: '2-digit', day: '2-digit', hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'}) + ')');
                await waitTime(secondsToReload);
                break;
            case STATUS.PURCHASED:
                doLog('Player purchased!');
                restart = false;
                break;
        }
    }
    doLog('The end!');
};

await main();
