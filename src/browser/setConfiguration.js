export const setConfiguration = async (page) => {
    const customUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';
    await page.setViewport({
        width: 1600, 
        height: 1200,
	deviceScaleFactor: 1,
    });
    await page.setUserAgent(customUA);
}

export const STATUS = Object.freeze({
    PURCHASED: 1,
    LOST: 2,
    PENDING: 3,
});