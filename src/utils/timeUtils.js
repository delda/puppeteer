export const waitTime = async (seconds) => {
    return new Promise(resolve => {
        setTimeout(resolve, seconds * 1000);
    });
}

export const waitRandomTime = async () => {
    const time = Math.floor(Math.random() * 5 + 1) ;
    return waitTime(time);
}
