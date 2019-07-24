var osu = require('node-os-utils');

var cpu = osu.cpu;

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

exports.getEmoji = function (client, emojiID) {
    return client.emojis.find(emoji => emoji.name === emojiID);
}

exports.getRandomValue = function (array) {
    return array[getRandomInt(array.length)];
}

exports.getRandomInt = getRandomInt;


exports.secondsToString = function (seconds) {
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    return numhours + "h" + numminutes + "m" + numseconds + "s";
}

var cpuUsage;

exports.getCPUUSage = function () {
    return cpuUsage;
}


cpu.usage()
    .then(info => {
        cpuUsage = info;
    })