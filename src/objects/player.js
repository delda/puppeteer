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
        const honesty = ['onesta', 'retta'];
        const isHonest = honesty.includes(this.honesty)
        const median = (this.median === '' ? '---' : this.median.toPrintablePrice())
        doLog(`  - ${this.id} ${this.name.padEnd(20, ' ').substring(0, 20)} ${this.age.padEnd(6, ' ').substring(0, 6)} ${parseInt(this.price).toPrintablePrice().padStart(10, ' ')} ${median.padStart(10, ' ')} ` + (isHonest ? 'O' : ''));
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
        const keeperIdx = SKILL_TABLE.findIndex(x => x === this.keeper);
        doLog('  - Keeper:         ' + progressBar(SKILL_TABLE.length, keeperIdx) + ((keeperIdx < 10) ? ' ' : '') + ' (' + keeperIdx + ') ' + this.keeper);
        const defenderIdx = SKILL_TABLE.findIndex(x => x === this.defender);
        doLog('  - Defender:       ' + progressBar(SKILL_TABLE.length, defenderIdx) + ((defenderIdx < 10) ? ' ' : '')  + ' (' + defenderIdx + ') ' + this.defender);
        const playmakerIdx = SKILL_TABLE.findIndex(x => x === this.playmaker);
        doLog('  - Playmaker:      ' + progressBar(SKILL_TABLE.length, playmakerIdx) + ((playmakerIdx < 10) ? ' ' : '')  + ' (' + playmakerIdx + ') '+ this.playmaker);
        const wingerIdx = SKILL_TABLE.findIndex(x => x === this.winger);
        doLog('  - Winger:         ' + progressBar(SKILL_TABLE.length, wingerIdx) + ((wingerIdx < 10) ? ' ' : '')  + ' (' + wingerIdx + ') ' + this.winger);
        const passerIdx = SKILL_TABLE.findIndex(x => x === this.passer) ;
        doLog('  - Passer:         ' + progressBar(SKILL_TABLE.length, passerIdx) + ((passerIdx < 10) ? ' ' : '')  + ' (' + passerIdx + ') ' + this.passer);
        const scorerIdx = SKILL_TABLE.findIndex(x => x === this.scorer);
        doLog('  - Scorer:         ' + progressBar(SKILL_TABLE.length, scorerIdx) + ((scorerIdx < 10) ? ' ' : '')  + ' (' + scorerIdx + ') ' + this.scorer);
        const kickerIdx = SKILL_TABLE.findIndex(x => x === this.kicker);
        doLog('  - Kicker:         ' + progressBar(SKILL_TABLE.length, kickerIdx) + ((kickerIdx < 10) ? ' ' : '')  + ' (' + kickerIdx + ') ' + this.kicker);
    }

    printPlayer() {
        this.shortPrint();
        this.auctionPrint();
        this.characterPrint();
        this.skillPrint();
    }
}
