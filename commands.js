var utils = require('./utils.js');
var textLoader = require('./textLoader.js');

exports.commandsCommand = function (message) {
    var command_list = "";
    var commands = textLoader.getJSON().commands;
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
    if(max <= 0){
        message.channel.send("Max number has to be equal or higher than your IQ(1). " + utils.getEmoji(client,"420"));
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
    if(rolls <= 0 || isNaN(rolls)){
        message.channel.send("Number of rolls has to be equal or higher than your IQ(1). " + utils.getEmoji(client,"420"));
        return;
    }
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
    message.channel.send(textLoader.getJSON().miscTextBits.purpose);
}

exports.mentionEvent = function(message, client) {
    var replies = textLoader.mentionReplies();
    message.channel.send(replies[utils.getRandomInt(replies.length-1)] + " " + utils.getEmoji(client,"wut".toString()));
}

exports.chooseCommand = function(message,args) {
    if(args[0] == undefined) {
        message.channel.send(textLoader.getJSON().descriptions[4]);
        return;
    }
    message.channel.send(args[utils.getRandomInt(args.length)]);
}