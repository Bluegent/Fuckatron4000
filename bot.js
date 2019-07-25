var Commands = require('./commands.js');
var auth = require('./auth.json');
var Discord = require('discord.js');
var textLoader = require('./textLoader.js');
var utils = require('./utils.js');

// Initialize Discord Bot
var bot = new Discord.Client();
bot.login(auth.token);

bot.on("ready", () => {
    console.log("Starting...");
    textLoader.start();
    textLoader.loadImageCommands();
    console.log("JSON setup complete.");
    Commands.mapCommands();
    var channel = bot.channels.find(channel => channel.name == "bot-test");
    var woke = utils.getEmoji(bot, "woke");
    channel.send(woke.toString() + utils.getRandomValue(textLoader.getJSON().flavorText.awaken) + woke.toString());
    var log = textLoader.getLastStartUplog();
    if(log!==undefined)
        channel.send("Startup log:```" + log + "```");

});

bot.on("message", (message) => {
    Commands.onMessage(message,bot);
    Commands.mentionEvent(message, bot);
});
