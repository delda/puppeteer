Number.prototype.toPrintablePrice = function () {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '€';
};

Number.prototype.toDate = function () {
    let time = this;
    let days = Math.floor(time / 86400);
    let hours = Math.floor((time % 86400) / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = parseInt(time % 60);
    let result = '';
    if (time === 0) result += '0s';
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (seconds > 0) result += `${seconds}s`;
    if (result === '') result = '0s';
    return result;
};

Number.prototype.toDateTime = function () {
    const dateNumber = this;
    const dateDate = new Date(dateNumber);
    return dateDate.toLocaleString('it-IT', {year: 'numeric', month: '2-digit', day: '2-digit', hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'});
}
