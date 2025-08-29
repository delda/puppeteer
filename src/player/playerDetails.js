import {doLog} from '../utils/logUtils.js';
import {setConfiguration} from "../browser/setConfiguration.js";
import {screenshot} from "../utils/screenshotUtils.js";
import "../extensions/stringExtensions.js";
import "../extensions/numberExtensions.js";
import {Player} from "../objects/player.js";
import {waitRandomTime} from "../utils/timeUtils.js";
import {navigateToUrl} from "../browser/navigation.js";

export const playerValues = async (browser, url) => {
    const tabNew = await browser.newPage();
    await setConfiguration(tabNew);
    // doLog();
    // doLog('## Player page');
    await navigateToUrl(tabNew, url);
    await screenshot(tabNew, 'player');
    // Name
    const divH1 = await tabNew.$('h1.hasByline.flex-inline');
    const nameHTML = await tabNew.evaluate(element => element.innerText, divH1);
    const nameSplit = nameHTML.split('\n');
    const name = nameSplit[1].trim().replace(/[0-9]+\. /, '');
    // ID
    const re = /playerId=([0-9]+)/;
    const playerMatchId = url.match(re);
    const playerId = playerMatchId[1];
    // Età
    const divAge = await tabNew.$('div.byline');
    const ageHTML = await tabNew.evaluate(element => element.innerText, divAge);
    const numbers = ageHTML.match(/[0-9]+/g);
    const age = numbers[0]+'.'+numbers[1];
    // Date
    const playerDateDiv = await tabNew.$('#ctl00_ctl00_CPContent_CPMain_updBid > div.alert > p');
    const playerDateValue = await tabNew.evaluate(element => element.innerText, playerDateDiv);
    const dateString = playerDateValue.replace('Scadenza:', '').trim();
    const baseDate = dateString.toDate();
    const datetime = dateString.toDate().toLocaleString("it-IT", {timeZone: "Europe/Rome"});
    // Price
    const playerPriceDiv = await tabNew.$('input#ctl00_ctl00_CPContent_CPMain_txtBid');
    const playerPriceValue = await tabNew.evaluate(element => element.value, playerPriceDiv);
    const price = parseInt(playerPriceValue.replace(/ /g, ''));
    // Gentleness
    const playerInfoDiv = await tabNew.$$('#ctl00_ctl00_CPContent_CPMain_pnlplayerInfo > p > a');
    const gentleness = await tabNew.evaluate(element => element.innerHTML, playerInfoDiv[0]);
    // Aggressiveness
    const aggressiveness = await tabNew.evaluate(element => element.innerHTML, playerInfoDiv[1]);
    // Honesty
    const honesty = await tabNew.evaluate(element => element.innerHTML, playerInfoDiv[2]);
    // Form
    const playerFormSpan = await tabNew.$('tr#ctl00_ctl00_CPContent_CPMain_ucPlayerSkills_trForm > td.nowrap > div > div.bar-level > span.bar-denomination');
    const form = await tabNew.evaluate(element => element.innerHTML, playerFormSpan);
    // Stamina
    const playerStaminaSpan = await tabNew.$('#ctl00_ctl00_CPContent_CPMain_ucPlayerSkills_trStamina > td > div > div.bar-level > span.bar-denomination');
    const stamina = await tabNew.evaluate(element => element.innerHTML, playerStaminaSpan);
    // Keeper
    const playerKeeperSpan = await tabNew.$('#ctl00_ctl00_CPContent_CPMain_ucPlayerSkills_trKeeper span.bar-denomination');
    const keeper = await tabNew.evaluate(element => element.innerHTML, playerKeeperSpan);
    // Defender
    const playerDefenderSpan = await tabNew.$('#ctl00_ctl00_CPContent_CPMain_ucPlayerSkills_trDefender span.bar-denomination');
    const defender = await tabNew.evaluate(element => element.innerHTML, playerDefenderSpan);
    // Playmaker
    const playerPlaymakerSpan = await tabNew.$('#ctl00_ctl00_CPContent_CPMain_ucPlayerSkills_trPlaymaker span.bar-denomination');
    const playmaker = await tabNew.evaluate(element => element.innerHTML, playerPlaymakerSpan);
    // Winger
    const playerWingerSpan = await tabNew.$('#ctl00_ctl00_CPContent_CPMain_ucPlayerSkills_trWinger span.bar-denomination');
    const winger = await tabNew.evaluate(element => element.innerHTML, playerWingerSpan);
    // Passer
    const playerPasserSpan = await tabNew.$('#ctl00_ctl00_CPContent_CPMain_ucPlayerSkills_trPasser span.bar-denomination');
    const passer = await tabNew.evaluate(element => element.innerHTML, playerPasserSpan);
    // Scorer
    const playerScorerSpan = await tabNew.$('#ctl00_ctl00_CPContent_CPMain_ucPlayerSkills_trScorer span.bar-denomination');
    const scorer = await tabNew.evaluate(element => element.innerHTML, playerScorerSpan);
    // Kicker
    const playerKickerSpan = await tabNew.$('#ctl00_ctl00_CPContent_CPMain_ucPlayerSkills_trKicker span.bar-denomination');
    const kicker = await tabNew.evaluate(element => element.innerHTML, playerKickerSpan);
    // Transfer compare
    const playerCompareLink = await tabNew.$$('div#ctl00_ctl00_CPContent_CPSidebar_pnlRight > div.box.sidebarBox > div.boxBody > a');
    await waitRandomTime();
    await playerCompareLink[1].click();
    // doLog('## Transfer compare');
    await tabNew.waitForNavigation();
    await screenshot(tabNew, 'transfer_compare');
    let playerAverageDiv;
    if ((await tabNew.$('table > tbody.tablesorter-infoOnly > tr:nth-child(1) > th:nth-child(7)')) !== null) {
        playerAverageDiv = await tabNew.$('table > tbody.tablesorter-infoOnly > tr:nth-child(1) > th:nth-child(7)');
    } else {
        playerAverageDiv = '';
    }
    let average = '';
    if (playerAverageDiv) {
        average = await tabNew.evaluate(element => parseInt(element.innerHTML.replace(/&nbsp;|€/g, '')), playerAverageDiv);
    }
    let playerMedianDiv;
    if ((await tabNew.$('table > tbody.tablesorter-infoOnly > tr:nth-child(2) > th:nth-child(7)')) !== null) {
        playerMedianDiv = await tabNew.$('table > tbody.tablesorter-infoOnly > tr:nth-child(2) > th:nth-child(7)');
    } else {
        playerMedianDiv = '';
    }
    let median = '';
    if (playerMedianDiv) {
        median = await tabNew.evaluate(element => parseInt(element.innerHTML.replace(/&nbsp;|€/g, '')), playerMedianDiv);
    }

    const player = new Player(name, playerId, age);
    player.setAuction(baseDate, price, average, median);
    player.setCharacter(gentleness, aggressiveness, honesty, form, stamina);
    player.setSkills(keeper, defender, playmaker, winger, passer, scorer, kicker);
    return player;
}
