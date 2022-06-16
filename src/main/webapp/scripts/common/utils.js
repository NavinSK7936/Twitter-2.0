
// Visibility Responser
function respondToVisibility(element, callback, options = { root: null, rootMargin: '0px', threshold: 1 }) {

    var observer = new IntersectionObserver(
        (entries, observer) => entries.forEach(
            entry => callback(entry.intersectionRatio > 0)
            ) , options);

    observer.observe(element);

    return observer;

}

// Move to main

const hashtagColor = "rgb(12, 114, 200)";

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

function getNumberSuffix(num) {
    return ~~(num / 10) % 10 == 1 ? 'th' : num % 10 == 1 ? 'st' : num % 10 == 2 ? 'nd' : num % 10 == 3 ? 'rd' : 'th';
}

function getDateForUserProfileFromTimestamp(timestamp) {
    return getDateForUserProfileFromDate(new Date(timestamp));
}

function getDateForUserProfileFromDate(date) {
    return date.getDate() + getNumberSuffix(date.getDate()) + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
}

function getTimeDifference(date1, date2) {

    var difference = date1.getTime() - date2.getTime();

    var daysDifference = Math.floor(difference/1000/60/60/24);
    difference -= daysDifference*1000*60*60*24

    var hoursDifference = Math.floor(difference/1000/60/60);
    difference -= hoursDifference*1000*60*60

    var minutesDifference = Math.floor(difference/1000/60);
    difference -= minutesDifference*1000*60

    var secondsDifference = Math.floor(difference/1000);

    if (daysDifference == 0)
        if (hoursDifference == 0)
            if (minutesDifference == 0)
                return secondsDifference + 's';
            else
                return minutesDifference + 'm';
        else
            return hoursDifference + 'h';
    else if (daysDifference <= 7)
        return daysDifference + 'd';

    return getDateForUserProfileFromDate(date2);

}

function getTimeSpanFromNow(timestamp) {

    return getTimeDifference(new Date(), new Date(timestamp));
    
}

function getTimestampFormattedValue(date) {
    return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
}


function get12hrFormattedDateTime(timestamp) {

    var matches = new Date(timestamp).toLocaleString().match(/^(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)$/);

    return {
        time: `${matches[4]}:${matches[5]} ${'PA'[+(matches[4] < 12)]}M`,
        date: `${monthNames[+matches[2]-1]} ${matches[1]}, ${matches[3]}`
    };
}

function getQueryKVMap(search) {
    const qp = new Map();
    if (search.length)
        for (const param of search.substring(1).split('&'))
            qp.set(...param.split('='));
    return qp;
}

function getQueryValue(search, key) {
    return getQueryKVMap(search).get(key);
}

function removeQueryParam(...params) {

    const qp = getQueryKVMap(window.location.search);

    for (const key of qp.keys())
        if (params.includes(key))
            qp.delete(key);
    
    return qp;

}

function getSearchQueryFromMap(mp) {

    var ans = '?';
    for (const key of mp.keys())
        ans += key + '=' + mp.get(key) + '&';
    
    return ans.slice(0, -1);

}

function getNthGrandChild(element, ...args) {

    for (const arg of args)
        element = element.children().eq(arg)
    
    return element;
}