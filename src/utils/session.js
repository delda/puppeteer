import fs from "fs";
import 'dotenv/config';
import {doLog} from "./logUtils.js";

const FILE_COOKIES = import.meta.dirname + '/../../cookies/cookies.json';
const FILE_HOST = import.meta.dirname + '/../../cookies/host.json';

export const checkPreviousSession =  () => {
    let isValid = false;
    if (!fs.existsSync(FILE_COOKIES)) return false;
    if (!fs.existsSync(FILE_HOST)) return false;
    const { mtime } = fs.statSync(FILE_COOKIES);
    const currentTime = new Date();
    let diff = Math.abs(currentTime - mtime) / 1000 - 3600;
    if (diff < 0) isValid = true;
    return isValid;
}

export const saveCookies = async (page) => {
    doLog('* Save cookies');
    const cookies = await page.cookies();
    const url = page.url();
    fs.writeFileSync(FILE_COOKIES, JSON.stringify(cookies, null, 2));
    fs.writeFileSync(FILE_HOST, JSON.stringify(url, null, 2));
}

export const setCookies = async (page) => {
    doLog('* Set cookies');
    let url = process.env.website;
    if (!checkPreviousSession()) return url;
    const cookiesString = fs.readFileSync(FILE_COOKIES, 'utf-8');
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
    url = fs.readFileSync(FILE_HOST, 'utf-8');
    return JSON.parse(url);
}

export const checkIsInSession = async (page) => {
    doLog('* Check session');
    return await page.$('a#myClubLink');
}
