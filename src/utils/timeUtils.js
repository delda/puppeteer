export const waitTime = async (seconds) => {
    return new Promise(resolve => {
        setTimeout(resolve, seconds * 1000);
    });
}

export const waitRandomTime = async (min = 5, max = 10) => {
    const time = Math.floor(Math.random() * (max - min + 1)) + min;
    return waitTime(time);
}
