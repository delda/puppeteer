String.prototype.toDate = function () {
    let [date, time] = this.split(' ');
    let [day, month, year] = date.split('-');
    let [hour, minute] = time.split(':');
    return new Date(`${year}-${month}-${day} ${hour}:${minute}`);
};
