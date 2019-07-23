var commands = ["!dice","!status","!commands","!server"];
var descriptions = [
    "Returns a random number between 0 and the number given. If a second number is given, rolls the dice that many times(max 20). Usage: `!dice <number> <rolls>`",
    "Tells you if a minecraft server is online. Usage: `!status <server address>`",
    "Prints a list of commands. Usage: `!commands`",
    "Prints the status of my minecraft server. Usage `!server` or `!server help`"
];

var auth = require('./auth.json');

var Discord = require('discord.js');



function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Initialize Discord Bot
var bot = new Discord.Client();
bot.login(auth.token);

bot.on("ready", () => {
    console.log("I am ready!");
    var channel = bot.channels.find(channel => channel.name == "bot-test");
    var woke = bot.emojis.find(emoji => emoji.name === "woke");
    channel.send(woke.toString()+" I have awakened. "+woke.toString());
});

bot.on("message", (message) => {
    if (message.content.startsWith('!')) {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            case 'commands': 
            {
                var command_list = "";
                for(var i=0;i<commands.length;++i) {
                    command_list += commands[i]+" ";
                }
                message.channel.send("Commands: \n```"+command_list+"```");
            }
            break;
            case 'dice':
            {
                if(args[0] == undefined) {
                    message.channel.send(descriptions[0]);
                    break;
                }
                var max = parseInt(args[0],10);
                if(isNaN(max)) {
                    var really = bot.emojis.find(emoji => emoji.name === "reallynigga");
                    message.channel.send(really.toString() +" Bruh, that ain't a number.");
                    break;
                }
                if(max>1000000) {
                    var yamero = bot.emojis.find(emoji => emoji.name === "yamero");
                    message.channel.send("Kyaa, onii-chan, that's too big! "+yamero.toString());
                    break;
                }
                var msg = "Your number(s): ";
                var rolls = 1;
                if(args[1] != undefined) {
                    rolls = parseInt(args[1]);
                }
                if(rolls < 0)
                    rolls = 1;
                if(rolls > 20)
                    rolls = 20;
                for(var i =0; i<rolls;++i) {
                    var number = getRandomInt(max);
                    var nice = "";
                    if(number == 69)
                        nice = " (nice)";
                    if(number >= 9001)
                        nice = " (IT'S OVER 9000!!!)"
                    if(number == 23) {
                        var emoji = bot.emojis.find(emoji => emoji.name === "evilmastermind");
                        nice = " cm gros "+emoji.toString();
                    }
                    msg += number+nice +", ";
                }
                msg = msg.substring(0, msg.length - 2) +"."
                message.channel.send(msg);
            }
            break;
            case 'status':
            {
                if(args[0] == undefined) {
                    message.channel.send(descriptions[1]);
                    break;
                }
                var server_addr = args[0];
                const { exec } = require('child_process');
                exec('mcstatus '+server_addr+' status', (err, stdout, stderr) => {
                //`${stderr}`
                if(err){
                    var error_str = `${stderr}`;
                    error_str = error_str.trim();
                    console.log(error_str);
                    if(error_str.endsWith("timed out")){
                        message.channel.send("Server offline.");
                    } else {
                        message.channel.send("Something went wrong...");
                    }
                } else {
                    message.channel.send(`${stdout}`);
                }
                
                });
            }    
            break;
            case 'server':
            {
                if(args[0] == undefined) {
                    const { exec } = require('child_process');
                    exec('mcstatus dochia.go.ro:25565 status', (err, stdout, stderr) => {
                    //`${stderr}`
                    if(err){
                        var error_str = `${stderr}`;
                        error_str = error_str.trim();
                        console.log(error_str);
                        if(error_str.endsWith("timed out")){
                            message.channel.send("Server offline.");
                        } else {
                            message.channel.send("Something went wrong...");
                        }
                    } else {
                        message.channel.send(`${stdout}`);
                    }
                    
                    });
                    break;
                }
                else if(args[0] == "help") {
                    message.channel.send(descriptions[3]);
                }
            }
            break;
        }
     }
});
