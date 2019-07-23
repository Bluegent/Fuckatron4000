var Commands = require('./commands.js');
var auth = require('./auth.json');
var Discord = require('discord.js');
var textLoader = require('./textLoader.js');

// Initialize Discord Bot
var bot = new Discord.Client();
bot.login(auth.token);

bot.on("ready", () => {
    console.log("I am ready!");
    
    var channel = bot.channels.find(channel => channel.name == "bot-test");
    var woke = bot.emojis.find(emoji => emoji.name === "woke");
    channel.send(woke.toString() + " I have awakened. " + woke.toString());
    textLoader.start();
});

bot.on("message", (message) => {
    if (message.content.startsWith('!')) {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch (cmd) {
            case 'commands':
                {
                    Commands.commandsCommand(message);
                }
                break;
            case 'dice':
                {
                    Commands.diceCommand(message, args, bot);
                }
                break;
            case 'status':
                {
                   Commands.statusCommand(message,args,bot);
                }
                break;
            case 'server':
                {
                    Commands.serverCommand(message,args,bot);
                }
                break;
            case 'purpose':
                {
                    Commands.purposeCommand(message);
                }
                break;
            case 'choose':
                {
                    Commands.chooseCommand(message,args);
                }
                break;
        }
    }
    else if (message.isMentioned(bot.users.get("603095851195432961"))) {
        Commands.mentionEvent(message,bot);
    }
});
