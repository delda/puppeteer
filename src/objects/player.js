import {doLog, progressBar} from "../utils/logUtils.js";
import {
    aggressivenessTable,
    formTable,
    gentlenessTable,
    honestyTable,
    skills,
    staminaTable
} from "../utils/constants.js";

export class Player {
    constructor(name, playerId, age) {
        this.name = name;
        this.id = playerId;
        this.age = age;
    }

    setAuction(datetime, price, average, median) {
        this.date = datetime;
        this.price = price;
        this.adverage = average;
        this.median = median;
    }

    setCharacter(gentleness, aggressiveness, honesty, form, stamina) {
        this.gentleness = gentleness;
        this.aggressiveness = aggressiveness;
        this.honesty = honesty;
        this.form = form;
        this.stamina = stamina;
    }

    setSkills(keeper, defender, playmaker, winger, passer, scorer, kicker) {
        this.keeper = keeper;
        this.defender = defender;
        this.playmaker = playmaker;
        this.winger = winger;
        this.passer = passer;
        this.scorer = scorer;
        this.kicker = kicker;
    }

    shortPrint() {
        doLog()
        doLog('  - Name:           ' + this.name);
        doLog('  - ID:             ' + this.id);
        doLog('  - Age:            ' + this.age);
    }

    auctionPrint() {
        doLog('  - Date:           ' + this.date.toLocaleString("it-IT", {timeZone: "Europe/Rome"}).toString());
        doLog('  - Price:          ' + this.price.toPrintablePrice());
        doLog('  - Median:         ' + (this.median === '' ? '---' : this.median.toPrintablePrice()));
        doLog('  - Adverage:       ' + (this.adverage === '' ? '---' : this.adverage.toPrintablePrice()));
    }

    characterPrint() {
        const gentlenessIdx = gentlenessTable.findIndex(x => x === this.gentleness) + 1;
        doLog('  - Gentleness:     ' + progressBar(gentlenessTable.length, gentlenessIdx) + ' ' + this.gentleness);
        const aggressivenessIdx = aggressivenessTable.findIndex(x => x === this.aggressiveness) + 1;
        doLog('  - Aggressiveness: ' + progressBar(aggressivenessTable.length, aggressivenessIdx) + ' ' + this.aggressiveness);
        const honestyIdx = honestyTable.findIndex(x => x === this.honesty) + 1;
        doLog('  - Honesty:        ' + progressBar(honestyTable.length, honestyIdx) + ' ' + this.honesty);
        const formIdx = formTable.findIndex(x => x === this.form) + 1;
        doLog('  - Form:           ' + progressBar(formTable.length, formIdx) + ' ' + this.form);
        const staminaIdx = staminaTable.findIndex(x => x === this.stamina) + 1;
        doLog('  - Stamina:        ' + progressBar(staminaTable.length, staminaIdx) + ' ' + this.stamina);
    }

    skillPrint() {
        const keeperIdx = skills.findIndex(x => x === this.keeper) + 1;
        doLog('  - Keeper:         ' + progressBar(skills.length, keeperIdx) + ' ' + this.keeper);
        const defenderIdx = skills.findIndex(x => x === this.defender) + 1;
        doLog('  - Defender:       ' + progressBar(skills.length, defenderIdx) + ' ' + this.defender);
        const playmakerIdx = skills.findIndex(x => x === this.playmaker) + 1;
        doLog('  - Playmaker:      ' + progressBar(skills.length, playmakerIdx) + ' ' + this.playmaker);
        const wingerIdx = skills.findIndex(x => x === this.winger) + 1;
        doLog('  - Winger:         ' + progressBar(skills.length, wingerIdx) + ' ' + this.winger);
        const passerIdx = skills.findIndex(x => x === this.passer) + 1;
        doLog('  - Passer:         ' + progressBar(skills.length, passerIdx) + ' ' + this.passer);
        const scorerIdx = skills.findIndex(x => x === this.scorer) + 1;
        doLog('  - Scorer:         ' + progressBar(skills.length, scorerIdx) + ' ' + this.scorer);
        const kickerIdx = skills.findIndex(x => x === this.kicker) + 1;
        doLog('  - Kicker:         ' + progressBar(skills.length, kickerIdx) + ' ' + this.kicker);
    }

    printPlayer() {
        this.shortPrint();
        this.auctionPrint();
        this.characterPrint();
        this.skillPrint();
    }
}
