var Discord = require('discord.js');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Initialize Discord Bot
var bot = new Discord.Client();
bot.login("NjAzMDk1ODUxMTk1NDMyOTYx.XTayFg.eJIeYqm3H6Bn7yo4Fjoc4fW57wo");

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
            // !ping
            case 'dice':
            {
                if(args[0] == undefined) {
                    message.channel.send("Returns a random number between 0 and the number given.");
                    break;
                }
                var max = parseInt(args[0],10);
                if(isNaN(max)) {
                    var really = bot.emojis.find(emoji => emoji.name === "reallynigga");
                    message.channel.send(really.toString() +" Bruh, that ain't a number.");
                    break;
                }
                var number = getRandomInt(max);
                var nice = "";
                if(number==69)
                    nice = "(nice)";
                message.channel.send('Your number: '+getRandomInt(max)+nice);
            }
            break;
            case 'status':
            {
                const { exec } = require('child_process');
                exec('mcstatus dochia.go.ro:25565 status', (err, stdout, stderr) => {
                //`${stderr}`
                if(err){
                    var error_str = `${stderr}`;
                    error_str = error_str.trim();
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
        }
     }
});
