var Discord = require("discord.js");
exports.getRandomInt = function (max) {
    return Math.floor(Math.random() * Math.floor(max));
}


exports.getEmoji = function (client, emojiID) {
    return client.emojis.find(emoji => emoji.name === emojiID);
}