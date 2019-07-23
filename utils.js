
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

exports.getEmoji = function (client, emojiID) {
    return client.emojis.find(emoji => emoji.name === emojiID);
}

exports.getRandomValue = function(array) {
    return array[getRandomInt(array.length)];
}

exports.getRandomInt = getRandomInt;