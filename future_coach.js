import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { initBrowser } from './src/browser/initBrowser.js';
import { doLog } from './src/utils/logUtils.js';
import { filteringFeatureCoachPlayers, searchNewPlayer } from "./src/player/playerSearch.js";
import { saveTransfersCompare } from "./src/player/transferCompare.js";

const main = async () => {
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--start-maximized'],
        defaultViewport: null
    });
    let players = null;
    try {
        const page = await initBrowser(browser);
        let featureCoachConfig = JSON.parse('{"auctionPercent": 1000, "age":{"min":35, "max":99}, "skills":[{"type":10, "min":7, "max":7}, {"type":9, "min":7, "max":20}], "price":{"minPrice":0,"maxPrice":10000000}}');
        players = await searchNewPlayer(browser, page, featureCoachConfig);
        players = await filteringFeatureCoachPlayers(players);
        await saveTransfersCompare(browser, players, 'buono');
        doLog('Execution completed successfully.');
    } catch (err) {
        console.error('Error during execution:', err);
    } finally {
        await browser.close();
    }
};

await main();
