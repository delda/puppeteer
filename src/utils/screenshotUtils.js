export const screenshot = async (page, text) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    const printableDate = `${year}${month}${day}${hour}${minute}${second}`;
    await page.screenshot({ path: `img/${printableDate}-${text}.jpg`, fullPage: true });
};

