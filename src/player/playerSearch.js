import {screenshot} from '../utils/screenshotUtils.js';
import {doLog} from '../utils/logUtils.js';
import {playerValues} from './playerDetails.js';
import {cookieBar} from "../browser/cookieBar.js";
import {waitRandomTime} from "../utils/timeUtils.js";
import {SKILL_DROP_DOWN, SKILL_TABLE} from "../utils/constants.js";
import {parse} from "dotenv";

export const searchNewPlayer = async (browser, page, config) => {
    doLog('  - Click on transfer page');
    const transferButton = await page.$('.scTransfer');
    await cookieBar(page);
    await waitRandomTime();
    await transferButton.click();

    // Search page
    doLog();
    doLog('## Search page');
    await page.waitForNavigation();

    doLog('  - Select min age: '+config.age.min);
    await page.select('#ctl00_ctl00_CPContent_CPMain_ddlAgeMin', config.age.min.toString());
    await waitRandomTime();
    doLog('  - Select max age: '+config.age.max);
    await page.select('#ctl00_ctl00_CPContent_CPMain_ddlAgeMax', config.age.max.toString());
    await waitRandomTime();
    let skills = config.skills;
    for (var i=0; i < config.skills.length; i++) {
        let skill = skills[i];
        doLog('  - Select \'' + SKILL_DROP_DOWN[skill.type] + '\'');
        await page.select('#ctl00_ctl00_CPContent_CPMain_ddlSkill'+(i+1), skill.type.toString());
        await waitRandomTime();
        doLog('  - Select level from \'' + SKILL_TABLE[skill.min] + '\' (' + skill.min.toString() + ')');
        await page.select('#ctl00_ctl00_CPContent_CPMain_ddlSkill'+(i+1)+'Min', skill.min.toString());
        await waitRandomTime();
        doLog('  - Select level to \'' + SKILL_TABLE[skill.max] + '\' (' + skill.max.toString() + ')');
        await page.select('#ctl00_ctl00_CPContent_CPMain_ddlSkill'+(i+1)+'Max', skill.max.toString());
        await waitRandomTime();
    }
    await screenshot(page, 'search');
    const searchButton = await page.$('#ctl00_ctl00_CPContent_CPMain_butSearch');
    await waitRandomTime();
    await searchButton.click();

    doLog();
    doLog('## Search page results');
    await page.waitForNavigation();
    await screenshot(page, 'search-results');
    const players = await page.$$('#mainBody > div > div.flex h3 > a');
    const playersHandle = await Promise.all(
        players.map(handle => handle.getProperty('href'))
    );
    const playersHref = await Promise.all(
        playersHandle.map(handle => handle.jsonValue())
    );
    let result = [];
    for (const playerHref of playersHref) {
        await waitRandomTime();
        const player = await playerValues(browser, playerHref);
        player.shortPrint();
        result.push(player);
    }
    const stats = statsPlayers(result);
    doLog();
    doLog('## STATISTICS');
    doLog('advPrice:   ' + parseInt(stats.advPrice).toPrintablePrice());
    doLog('advAverage: ' + parseInt(stats.advAverage).toPrintablePrice());
    doLog('advMedian:  ' + parseInt(stats.advMedian).toPrintablePrice());
    doLog('minDate:    ' + stats.minDate.toDateTime());
    doLog('maxDate:    ' + stats.maxDate.toDateTime());
    return filteringPlayers(result, config);
};

export const filteringPlayers = (players, filters) => {
    doLog();
    doLog('- Filtering players...');
    const minPrice = filters.price.minPrice;
    const maxPrice = filters.price.maxPrice;
    const honesty = ['onesta', 'retta'];
    let filteredPlayers = players.filter((player) => {
        if (player.median === '') return false;
        return player.price > minPrice
            && player.price < maxPrice
            && player.price < (player.median / 2)
            && honesty.includes(player.honesty);
    });
    const numberPlayers = players.length;
    const numberFilteredPlayers = filteredPlayers.length;
    doLog('- ' + (numberPlayers - numberFilteredPlayers) + ' players filtered on ' + numberPlayers + ' (' + parseInt(((numberPlayers-numberFilteredPlayers)/numberPlayers)*100) + '%)');
    filteredPlayers = filteredPlayers.sort((p1, p2) => {
        const d1 = new Date(p1.date);
        const d2 = new Date(p2.date);
        if (d1 > d2) return 1;
        if (d1 < d2) return -1;
        if (p1.median > p2.median) return -1;
        if (p1.median < p2.median) return 1;
        return 0;
    });
    return filteredPlayers.shift();
}

export const statsPlayers = (players) => {
    const initialCarry = {
        sumPrice: 0,
        sumMedian: 0,
        sumAverage: 0,
        minDate: Number.MAX_SAFE_INTEGER,
        maxDate: 0
    };
    const stats = players.reduce((carry, player) => {
        carry.sumPrice += parseInt(player.price);
        carry.sumMedian += player.median ? parseInt(player.median) : 0;
        carry.sumAverage += player.average ? parseInt(player.average) : 0;
        carry.minDate = Math.min(carry.minDate, player.date);
        carry.maxDate = Math.max(carry.maxDate, player.date);
        return carry;
    }, initialCarry);
    const playerCount = players.length;
    stats.advPrice = stats.sumPrice / playerCount;
    stats.advMedian = stats.sumMedian / playerCount;
    stats.advAverage = stats.sumAverage / playerCount;

    return stats;
}