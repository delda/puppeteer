import {doLog, progressBar} from "../utils/logUtils.js";
import {
    AGGRESSIVENESS_TABLE,
    FORM_TABLE,
    GENTLENESS_TABLE,
    HONESTY_TABLE,
    SKILL_TABLE,
    STAMINA_TABLE
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
        this.average = average;
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
        doLog('  - Average:        ' + (this.average === '' ? '---' : this.average.toPrintablePrice()));
    }

    characterPrint() {
        const gentlenessIdx = GENTLENESS_TABLE.findIndex(x => x === this.gentleness) + 1;
        doLog('  - Gentleness:     ' + progressBar(GENTLENESS_TABLE.length, gentlenessIdx) + ' ' + this.gentleness);
        const aggressivenessIdx = AGGRESSIVENESS_TABLE.findIndex(x => x === this.aggressiveness) + 1;
        doLog('  - Aggressiveness: ' + progressBar(AGGRESSIVENESS_TABLE.length, aggressivenessIdx) + ' ' + this.aggressiveness);
        const honestyIdx = HONESTY_TABLE.findIndex(x => x === this.honesty) + 1;
        doLog('  - Honesty:        ' + progressBar(HONESTY_TABLE.length, honestyIdx) + ' ' + this.honesty);
        const formIdx = FORM_TABLE.findIndex(x => x === this.form) + 1;
        doLog('  - Form:           ' + progressBar(FORM_TABLE.length, formIdx) + ' ' + this.form);
        const staminaIdx = STAMINA_TABLE.findIndex(x => x === this.stamina) + 1;
        doLog('  - Stamina:        ' + progressBar(STAMINA_TABLE.length, staminaIdx) + ' ' + this.stamina);
    }

    skillPrint() {
        const keeperIdx = SKILL_TABLE.findIndex(x => x === this.keeper) + 1;
        doLog('  - Keeper:         ' + progressBar(SKILL_TABLE.length, keeperIdx) + ' ' + this.keeper);
        const defenderIdx = SKILL_TABLE.findIndex(x => x === this.defender) + 1;
        doLog('  - Defender:       ' + progressBar(SKILL_TABLE.length, defenderIdx) + ' ' + this.defender);
        const playmakerIdx = SKILL_TABLE.findIndex(x => x === this.playmaker) + 1;
        doLog('  - Playmaker:      ' + progressBar(SKILL_TABLE.length, playmakerIdx) + ' ' + this.playmaker);
        const wingerIdx = SKILL_TABLE.findIndex(x => x === this.winger) + 1;
        doLog('  - Winger:         ' + progressBar(SKILL_TABLE.length, wingerIdx) + ' ' + this.winger);
        const passerIdx = SKILL_TABLE.findIndex(x => x === this.passer) + 1;
        doLog('  - Passer:         ' + progressBar(SKILL_TABLE.length, passerIdx) + ' ' + this.passer);
        const scorerIdx = SKILL_TABLE.findIndex(x => x === this.scorer) + 1;
        doLog('  - Scorer:         ' + progressBar(SKILL_TABLE.length, scorerIdx) + ' ' + this.scorer);
        const kickerIdx = SKILL_TABLE.findIndex(x => x === this.kicker) + 1;
        doLog('  - Kicker:         ' + progressBar(SKILL_TABLE.length, kickerIdx) + ' ' + this.kicker);
    }

    printPlayer() {
        this.shortPrint();
        this.auctionPrint();
        this.characterPrint();
        this.skillPrint();
    }
}
