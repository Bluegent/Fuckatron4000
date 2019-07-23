var utils = require("./utils.js");

var commands = ["!dice", "!status", "!commands", "!server", "!purpose"];
var descriptions = [
    "Returns a random number between 0 and the number given. If a second number is given, rolls the dice that many times(max 20). Usage: `!dice <number> <rolls>`",
    "Tells you if a minecraft server is online. Usage: `!status <server address>`",
    "Prints a list of commands. Usage: `!commands`",
    "Prints the status of my minecraft server. Usage `!server` or `!server help`"
];

exports.commandsCommand = function (message) {
    var command_list = "";
    for (var i = 0; i < commands.length; ++i) {
        command_list += commands[i] + " ";
    }
    message.channel.send("Commands: \n```" + command_list + "```");
}


function getFlavorText(client,number) {
    var result = "";
    
    if (number == 23)
        result = " cm gros " + utils.getEmoji(client,"evilmastermind").toString().toString();
        
    if (number == 69)
        result = " (nice)";

    if (number >= 9001)
        result = " (IT'S OVER 9000!!!)"

    return result;
}

exports.diceCommand = function (message, args, client) {
    if (args[0] == undefined) {
        message.channel.send(descriptions[0]);
        return;
    }
    var max = parseInt(args[0], 10);
    if (isNaN(max)) {
        var really = utils.getEmoji(client, "reallynigga");
        message.channel.send(really.toString() + " Bruh, that ain't a number.");
        return;
    }
    if (max > 1000000) {
        var yamero = utils.getEmoji(client, "yamero");
        message.channel.send("Kyaa, onii-chan, that's too big! " + yamero.toString());
        return;
    }
    var msg = "Your roll(s): ";
    var rolls = 1;
    if (args[1] != undefined) {
        rolls = parseInt(args[1]);
    }
    if (rolls < 0)
        rolls = 1;
    if (rolls > 20)
        rolls = 20;
    for (var i = 0; i < rolls; ++i) {
        var number = utils.getRandomInt(max)+1;
        msg += number + getFlavorText(client, number) + ", ";
    }
    msg = msg.substring(0, msg.length - 2) + "."
    message.channel.send(msg);
}

function getServerStatus(address,message, client){
    const { exec } = require('child_process');
    exec('mcstatus ' + address + ' status', (err, stdout, stderr) => {
        //`${stderr}`

        var stderr = `${stderr}`;
        var stdout = `${stdout}`;

        if (err) {
            var error_str = stderr;
            error_str = error_str.trim();
            if (error_str.endsWith("timed out")) {
                message.channel.send("Server offline." + utils.getEmoji(client,"sad").toString());
            } else {
                message.channel.send("Something went wrong...");
            }
        } else {
            message.channel.send("```"+stdout+"```");
        }
        
    });
    return results;
}

exports.statusCommand = function(message, args, client) {
    if (args[0] == undefined) {
        message.channel.send(descriptions[1]);
        return;
    }
    var server_addr = args[0];
    var results = getServerStatus(server_addr,message, client);  
}

exports.serverCommand = function(message, args, client) {
    if(args[0] === undefined)
        getServerStatus("dochia.go.ro:25565",message,client);
    else if(args[0] == "helpd")
        message.channel.send(descriptions[3]);
}

exports.purposeCommand = function(message) {
    message.channel.send("https://i.imgur.com/hrV0WCp.png");
}

var tagReplies = [
    "I heard you were talking shit about me. I'll fuck you up.",
    "Shabat Shalom, motherfucker.",
    "The fuck you want?",
    "Where the bitches at?",
    "Square up, homeboy.",
    "New token, who dis?",
    "What now?",
    "!commands",
    "I am a cyber nigga, I browse the dark web.",
    "Ye?",
    "",
    "Cyka blyat, pidaras blyat.",
    "What's good, homie?",
    "Aye?"
];

exports.mentionEvent = function(message, client) {
    message.channel.send(tagReplies[utils.getRandomInt(tagReplies.length)] + " " + utils.getEmoji(client,"wut".toString()));
}