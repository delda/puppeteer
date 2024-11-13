import puppeteer from 'puppeteer';
import {cleanDirectory} from './src/utils/fileUtils.js';
import {initBrowser} from './src/browser/initBrowser.js';
import {findAuctionInProgress, checkRelaunchProposal} from './src/player/auctionUtils.js';
import {searchNewPlayer} from './src/player/playerSearch.js';
import {doLog} from './src/utils/logUtils.js';
import {waitTime} from "./src/utils/timeUtils.js";
import {STATUS} from "./src/browser/setConfiguration.js";

const main = async () => {
    const config = '{"age":{"min":21, "max":27}, "skills":[{"type":6, "min":9, "max":11},{"type":8,"min":7,"max":8},{"type":5,"min":0,"max":8},{"type":4,"min":0,"max":8}], "price":{"minPrice":50000,"maxPrice":200000}}';
    // const config = '{"age":{"min":21, "max":27}, "skills":[{"type":6, "min":7, "max":9}], "price":{"minPrice":50000,"maxPrice":200000}}';
    const configJson = JSON.parse(config);

    cleanDirectory('img');

    let restart = true;
    let player = null;
    while (restart) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await initBrowser(browser);
        const followedPlayer = await findAuctionInProgress(browser, page);
        if (followedPlayer) {
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
                console.log('lost');
                player = null;
                break;
            case STATUS.PENDING:
                const endDate = player.date;
                const currentDate = new Date();
                const timeToEnd = parseInt((endDate.getTime() - currentDate.getTime()) / 1000) - 60 * 60;
                doLog('- Wait ' + timeToEnd.toDate());
                await waitTime(timeToEnd);
                break;
            case STATUS.PURCHASED:
                console.log('purchased');
                restart = false;
                break;
        }
    }
    console.log('The end!');
};

await main();

/*
STEP
- inizializzazione del browser
- login
- cookie bar
- ricerca
- file con le configurazioni
- estrazione dati giocatori
- struttura dato giocatore
- estrazione del player su cui puntare
- utilizzo degli screenshot
- offerta x un giocatore
- estrazione offerte attive
- sistema di log
- divisione delle funzioni in più file
- continuous search
- tempo random nella ricerca
*/
