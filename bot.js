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

    var channel = bot.channels.find(channel => channel.name == "bot-test");
    var woke = utils.getEmoji(bot, "woke");
    channel.send(woke.toString() + utils.getRandomValue(textLoader.getJSON().flavorText.awaken) + woke.toString());

});

bot.on("message", (message) => {
    console.log("On mesage:" +message.content.substr(0,255)+"...")
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
                    Commands.statusCommand(message, args, bot);
                }
                break;
            case 'server':
                {
                    Commands.serverCommand(message, args, bot);
                }
                break;
            case 'purpose':
                {
                    Commands.purposeCommand(message);
                }
                break;
            case 'choose':
                {
                    Commands.chooseCommand(message, args);
                }
                break;
            case 'ping':
                {
                    Commands.pingCommand(message, args);
                }
                break;
            case 'registerImage':
                {
                    Commands.registerCommand(message, args);
                }
                break;
            case 'imageCommands':
                {
                    Commands.imageCommands(message);
                }
                break;
            case 'update':
                    {
                        Commands.updatecommand(message);
                    }
                    break;
            default:
                {
                    Commands.customImageCommand(message);
                }
                break;
        }
    }
    else if (message.isMentioned(bot.users.get("603095851195432961"))) {
        Commands.mentionEvent(message, bot);
    }
});
