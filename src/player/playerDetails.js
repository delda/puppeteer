import {doLog} from '../utils/logUtils.js';
import {setConfiguration} from "../browser/setConfiguration.js";
import {screenshot} from "../utils/screenshotUtils.js";
import "../utils/dateExtensions.js";
import "../utils/numberExtensions.js";
import {Player} from "../objects/player.js";

export const playerValues = async (browser, url) => {
    const tabNew = await browser.newPage();
    await setConfiguration(tabNew);
    doLog();
    doLog('## Player page');
    await tabNew.goto(url, {waitUntil: 'domcontentloaded'}).catch((err) => doLog('error loading url: ' + err.message));
    await screenshot(tabNew, 'player');
    // Name
    const divH1 = await tabNew.$('h1.hasByline.flex-inline');
    const nameHTML = await tabNew.evaluate(element => element.innerText, divH1);
    const nameSplit = nameHTML.split('\n');
    const name = nameSplit[1].trim();
    doLog('  - Name: ' + name);
    // ID
    const re = /playerId=([0-9]+)/;
    const playerMatchId = url.match(re);
    const playerId = playerMatchId[1];
    doLog('  - ID: ' + playerId);
    // Età
    const divAge = await tabNew.$('div.byline');
    const ageHTML = await tabNew.evaluate(element => element.innerText, divAge);
    const numbers = ageHTML.match(/[0-9]+/g);
    const age = numbers[0]+'.'+numbers[1];
    doLog('  - Age: ' + age);
    // Date
    const playerDateDiv = await tabNew.$('#ctl00_ctl00_CPContent_CPMain_updBid > div.alert > p');
    const playerDateValue = await tabNew.evaluate(element => element.innerText, playerDateDiv);
    const dateString = playerDateValue.replace('Scadenza:', '').trim();
    const baseDate = dateString.toDate();
    const datetime = dateString.toDate().toLocaleString("it-IT", {timeZone: "Europe/Rome"});
    doLog('  - Date: ' + datetime.toString());
    // Price
    const playerPriceDiv = await tabNew.$('input#ctl00_ctl00_CPContent_CPMain_txtBid');
    const playerPriceValue = await tabNew.evaluate(element => element.value, playerPriceDiv);
    const price = parseInt(playerPriceValue.replace(/ /g, ''));
    doLog('  - Price: ' + price.toPrintablePrice());
    // Gentleness
    const playerInfoDiv = await tabNew.$$('#ctl00_ctl00_CPContent_CPMain_pnlplayerInfo > p > a');
    const gentleness = await tabNew.evaluate(element => element.innerHTML, playerInfoDiv[0]);
    doLog('  - Gentleness: ' + gentleness);
    // Aggressiveness
    const aggressiveness = await tabNew.evaluate(element => element.innerHTML, playerInfoDiv[1]);
    doLog('  - Aggressiveness: ' + aggressiveness);
    // Honesty
    const honesty = await tabNew.evaluate(element => element.innerHTML, playerInfoDiv[2]);
    doLog('  - Honesty: ' + honesty);
    // Transfer compare
    const playerCompareLink = await tabNew.$$('div#ctl00_ctl00_CPContent_CPSidebar_pnlRight > div.box.sidebarBox > div.boxBody > a');
    await playerCompareLink[1].click();
    doLog();
    doLog('## Transfer compare');
    await tabNew.waitForNavigation();
    await screenshot(tabNew, 'transfer_compare');
    let playerAdverageDiv;
    if ((await tabNew.$('table > tbody.tablesorter-infoOnly > tr:nth-child(1) > th:nth-child(7)')) !== null) {
        playerAdverageDiv = await tabNew.$('table > tbody.tablesorter-infoOnly > tr:nth-child(1) > th:nth-child(7)');
    } else {
        playerAdverageDiv = '';
    }
    let adverage = '---';
    if (playerAdverageDiv) {
        adverage = await tabNew.evaluate(element => parseInt(element.innerHTML.replace(/&nbsp;|€/g, '')), playerAdverageDiv);
    }
    doLog('  - Adverage: ' + ((adverage === '---') ? adverage : adverage.toPrintablePrice()));
    let playerMedianDiv;
    if ((await tabNew.$('table > tbody.tablesorter-infoOnly > tr:nth-child(2) > th:nth-child(7)')) !== null) {
        playerMedianDiv = await tabNew.$('table > tbody.tablesorter-infoOnly > tr:nth-child(2) > th:nth-child(7)');
    } else {
        playerMedianDiv = '';
    }
    let median = '---';
    if (playerMedianDiv) {
        median = await tabNew.evaluate(element => parseInt(element.innerHTML.replace(/&nbsp;|€/g, '')), playerMedianDiv);
    }
    doLog('  - Median: ' + ((median === '---') ? median : median.toPrintablePrice()));

    return new Player(name, playerId, age, baseDate, price, gentleness, aggressiveness, honesty, adverage, median);
}

