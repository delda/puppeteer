import {doLog} from '../utils/logUtils.js';
import {screenshot} from "../utils/screenshotUtils.js";
import {setConfiguration, STATUS} from "../browser/setConfiguration.js";
import {waitRandomTime, waitTime} from "../utils/timeUtils.js";
import {playerValues} from "./playerDetails.js";
import 'dotenv/config';
import {parse} from "dotenv";
import {navigateToUrl} from "../browser/navigation.js";

export const findAuctionInProgress = async (browser, page) => {
    doLog('  - Click on auction page');
    const link = await page.$('div.subMenuBox > div.boxBody > ul > li:nth-child(6)');
    if (!link) {
        doLog('  - No auction link found!');
        return null;
    }
    await waitRandomTime();
    await link.click();
    await page.waitForNavigation();
    doLog();
    doLog('## Auctions in progress');
    await screenshot(page, 'auction');

    const labelsH2 = await page.$$eval('table.naked h2', elements => { return elements.map(e => e.innerHTML)})
    const labelAuction = labelsH2.find(element => element.includes('Acquirente'));
    if (!labelAuction) {
        doLog('  - No auctions in progress!');
        return null;
    }
    doLog('  - Auction detected!');
    const auctionDiv = await page.$('div.club-transfer-table > table.naked tr > td:nth-child(3) > a');
    const playerInAuction = await page.evaluate(element => element.getAttribute('href'), auctionDiv);
    const url = await page.evaluate(() => { return window.location.href; });
    const baseUrl = url.match(/https.*hattrick.org/)[0];
    const playerUrl = baseUrl + playerInAuction;
    return playerValues(browser, playerUrl);
}

export const checkAuctionPlayer = async (page, player, config) => {
    let refreshDiv;
    let lastRelaunchTeam, lastRelaunchTeamDiv;
    let auctionButton, okButton;
    let playerDateDiv, playerDateValue;
    let dateString, endDate, currentDate, timeToEnd, timeToRelaunch, refreshPageTime;
    let checkAuction = true;
    let activeCheckAuction = true;
    let canRelaunch = false;
    let itIsTime = false;
    let priceTooHigh = false;
    const auctionPercent = parseInt(config.auctionPercent);
    const priceNotToBeExceeded = parseInt(player.median / 100 * auctionPercent);
    while (checkAuction) {
	    doLog();
        doLog('#### Refresh last relaunch');
        refreshDiv = await page.$('#ctl00_ctl00_CPContent_CPMain_lnkRefresh');
        await refreshDiv.click();
        await screenshot(page, 'refresh');
        lastRelaunchTeamDiv = await page.$('div#ctl00_ctl00_CPContent_CPMain_pnlHighestBid > p > a');
        lastRelaunchTeam = '---';
        if (lastRelaunchTeamDiv) lastRelaunchTeam = await page.evaluate(element => element.innerText.trim(), lastRelaunchTeamDiv);
        playerDateDiv = await page.$('#ctl00_ctl00_CPContent_CPMain_updBid > div.alert > p');
        playerDateValue = await page.evaluate(element => element.innerText, playerDateDiv);
        dateString = playerDateValue.replace('Scadenza:', '').trim();
        endDate = dateString.toDate();
        currentDate = new Date();
        timeToEnd = parseInt((endDate - currentDate) / 1000);
        if (timeToEnd < 0) timeToEnd = 0;
        timeToRelaunch = timeToEnd - (60 * 2 + 10);
        activeCheckAuction = true;
	    refreshPageTime = 0;
        if (timeToEnd > 60 * 60) {
            activeCheckAuction = false;
        }
        if (timeToEnd < 60 * 60) {
            refreshPageTime = 60 * 10;
        }
        if (timeToEnd < 60 * 10) {
            refreshPageTime = 60;
        } 
        if (timeToEnd < 60 * 5) {
            refreshPageTime = 15;
        }
        const playerPriceDiv = await page.$('input#ctl00_ctl00_CPContent_CPMain_txtBid');
        if (!playerPriceDiv) {
            doLog('    - The auction is over!');
            checkAuction = false;
            timeToRelaunch = 0;
            return STATUS.PURCHASED;
        }
        const playerPriceValue = await page.evaluate(element => element.value, playerPriceDiv);
        const price = parseInt(playerPriceValue.replace(/ /g, ''));
        canRelaunch = (lastRelaunchTeam !== process.env.team_name);
        priceTooHigh = price > priceNotToBeExceeded;
        if (priceTooHigh) {
            doLog('    - Price (' + price.toPrintablePrice() + ') over max price (' + priceNotToBeExceeded.toPrintablePrice() + ')!');
            return STATUS.LOST;
        }
        if (!activeCheckAuction) {
            doLog('    - Suspend active check: it\'s too early (' + timeToEnd.toDate() + ')');
            return STATUS.PENDING;
        }
        itIsTime = timeToRelaunch < 5;
        doLog('    - Deadline: ' + timeToEnd.toDate());
        doLog('    - Time to relaunch: ' + timeToRelaunch.toDate());
        doLog('    - Last relaunch is ' + (canRelaunch ? 'not' : '') + ' mine (' + lastRelaunchTeam + ')');
        doLog('    - Current price: ' + price.toPrintablePrice() + '; max price: ' + priceNotToBeExceeded.toPrintablePrice());
        if (canRelaunch && itIsTime) {
            doLog('    - !!! Relaunch !!!');
            auctionButton = await page.$('input#ctl00_ctl00_CPContent_CPMain_btnBid');
            await page.evaluate(element => element.click(), auctionButton);
            await screenshot(page, 'relaunch');
            okButton = await page.$('div#ft-bid-confirm > div > input[value="Ok"]');
            if (okButton) {
                doLog(okButton);
                await screenshot(page, 'relaunch_ok');
                await okButton.click();
            }
        }
        doLog('    - Waiting: ' + refreshPageTime.toDate());
        await waitTime(refreshPageTime);
    }
    return STATUS.PENDING;
}

export const checkRelaunchProposal = async (browser, player, config) => {
    const tabNew = await browser.newPage();
    await setConfiguration(tabNew);
    doLog();
    doLog('## Player in auction');
    player.printPlayer();
    const page = (await browser.pages())[0];
    const url = await page.evaluate(() => { return window.location.href; });
    const baseUrl = url.match(/https.*hattrick.org/)[0];
    const playerUrl = baseUrl + '/Club/Players/Player.aspx?playerId=' + player.id;
    await navigateToUrl(tabNew, playerUrl);
    await screenshot(tabNew, 'player_in_auction');
    return await checkAuctionPlayer(tabNew, player, config);
}
