export const setConfiguration = async (page) => {
    const customUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';
    await page.setViewport({
        width: 1600, 
        height: 1200,
	deviceScaleFactor: 1,
    });
    await page.setUserAgent(customUA);
}

export const SKILL_DROP_DOWN = [];
SKILL_DROP_DOWN[1] = 'Parate';
SKILL_DROP_DOWN[3] = 'Difesa';
SKILL_DROP_DOWN[4] = 'Regia';
SKILL_DROP_DOWN[5] = 'Cross';
SKILL_DROP_DOWN[6] = 'Attacco';
SKILL_DROP_DOWN[7] = 'Calci piazzati';
SKILL_DROP_DOWN[8] = 'Passaggi';
SKILL_DROP_DOWN[9] = 'Esperienza';
SKILL_DROP_DOWN[10] = 'Carisma';

export const STATUS = Object.freeze({
    PURCHASED: 1,
    LOST: 2,
    PENDING: 3,
});