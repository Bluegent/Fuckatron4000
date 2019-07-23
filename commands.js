var utils = require('./utils.js');
var textLoader = require('./textLoader.js');

exports.commandsCommand = function (message) {
    var command_list = "";
    var commands = textLoader.getJSON().commands;
    for (var i = 0; i < commands.length; ++i) {
        command_list += "!"+commands[i] + " ";
    }
    message.channel.send("Commands: \n```" + command_list + "```");
}


function getFlavorText(client, number) {
    var result = "";

    if (number == 23)
        result = " cm gros " + utils.getEmoji(client, "evilmastermind").toString().toString();

    if (number == 69)
        result = " (nice)";

    if (number >= 9001)
        result = " (IT'S OVER 9000!!!)"

    return result;
}

exports.diceCommand = function (message, args, client) {
    if (args[0] == undefined) {
        message.channel.send(textLoader.getJSON().descriptions[0]);
        return;
    }
    var max = parseInt(args[0], 10);
    if (isNaN(max)) {
        var really = utils.getEmoji(client, "reallynigga");
        message.channel.send(textLoader.getJSON().flavorText.nanDice + really.toString());
        return;
    }
    if (max <= 0) {
        message.channel.send(textLoader.getJSON().flavorText.lowDice + utils.getEmoji(client, "420"));
        return;

    }
    if (max > 1000000) {
        var yamero = utils.getEmoji(client, "yamero");
        message.channel.send(textLoader.getJSON().flavorText.diceTooBig + yamero.toString());
        return;
    }
    var msg = "Your roll(s): ";
    var rolls = 1;
    if (args[1] != undefined) {
        rolls = parseInt(args[1]);
    }
    if (rolls <= 0 || isNaN(rolls)) {
        message.channel.send(textLoader.getJSON().flavorText.lowRolls + utils.getEmoji(client, "420"));
        return;
    }
    if (rolls > 20)
        rolls = 20;
    for (var i = 0; i < rolls; ++i) {
        var number = utils.getRandomInt(max) + 1;
        msg += number + getFlavorText(client, number) + ", ";
    }
    msg = msg.substring(0, msg.length - 2) + "."
    message.channel.send(msg);
}

function getServerStatus(address, message, client) {
    const { exec } = require('child_process');
    exec('mcstatus ' + address + ' status', (err, stdout, stderr) => {
        //`${stderr}`

        var stderr = `${stderr}`;
        var stdout = `${stdout}`;

        if (err) {
            var error_str = stderr;
            error_str = error_str.trim();
            console.log(error_str);
            if (error_str.endsWith("timed out")) {
                message.channel.send(textLoader.getJSON().flavorText.serverStatusOffline + utils.getEmoji(client, "sad").toString());
            } else {
                message.channel.send(textLoader.getJSON().flavorText.serverStatusFailed);
            }
        } else {
            message.channel.send("```" + stdout + "```");
        }

    });
}

exports.statusCommand = function (message, args, client) {
    if (args[0] == undefined) {
        message.channel.send(textLoader.getJSON().descriptions[1]);
        return;
    }
    message.channel.send(textLoader.getJSON().flavorText.serverStatusWait);
    var server_addr = args[0];
    var results = getServerStatus(server_addr, message, client);
}

exports.serverCommand = function (message, args, client) {
    if (args[0] === undefined) {
        message.channel.send(textLoader.getJSON().flavorText.serverStatusWait);
        getServerStatus(textLoader.getJSON().myServer, message, client);
    }
    else if (args[0] == "help")
        message.channel.send(textLoader.getJSON().descriptions[3]);
}

exports.purposeCommand = function (message) {
    message.channel.send(utils.getRandomValue(textLoader.getJSON().miscTextBits.purpose));
}

exports.mentionEvent = function (message, client) {
    var replies = textLoader.mentionReplies();
    message.channel.send(utils.getRandomValue(replies) + " " + utils.getEmoji(client, "wut".toString()));
}

exports.chooseCommand = function (message, args) {
    if (args[0] == undefined) {
        message.channel.send(textLoader.getJSON().descriptions[4]);
        return;
    }
    message.channel.send(args[utils.getRandomInt(args.length)]);
}

function wrongCommand(message) {
    message.channel.send(textLoader.getJSON().flavorText.wrongCommand);
}

exports.pingCommand = function (message, args) {
    if (args[0] == "undefined") {
        message.channel.send(textLoader.getJSON().descriptions[4]);
        return;
    }
    var address = args[0];
    const { exec } = require('child_process');
    exec(textLoader.getJSON().flavorText.pingCommand + address, (err, stdout, stderr) => {
        if (err) {
            message.channel.send(textLoader.getJSON().flavorText.serverStatusFailed);
            console.log(stderr);
            return;
        }
        message.channel.send(textLoader.getJSON().flavorText.pingResponse + "```" + stdout + "```");
    });
}

exports.customImageCommand = function(message) {
    var command = message.content.split(' ')[0].replace('!','');
    if(command == undefined){
        wrongCommand(message);
    }
    if(textLoader.getImgCommands().has(command)){
        message.channel.send(textLoader.getImgCommands().get(command));
    } else{
        wrongCommand(message);
    }
}

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null && url.match(/^(http\:\/\/|https\:\/\/)/) != null);
}

exports.registerCommand = function(message,args ) {
    var allowAll = true;
    let users = textLoader.getJSON().authorizedUsers;
    let author = ""+message.author.id;

    if( allowAll || users.includes(author)){
        if(args[0] != undefined && args[1] != undefined && checkURL(args[1]) && !textLoader.getImgCommands().has(args[0]) && !textLoader.getJSON().commands.includes(args[0])){
            textLoader.getImgCommands().set(args[0],args[1]);
            textLoader.exportImageCommands();
            message.channel.send(textLoader.getJSON().flavorText.registerComplete);
        }
        else{
            message.channel.send(textLoader.getJSON().descriptions[6]);
        }
        
    }
    else{
        message.channel.send(textLoader.getJSON().flavorText.registerWrongUser);
    }
}

exports.imageCommands = function(message) {
    var list = "";
    
    var commands = textLoader.getImgCommands();
    for (const [key, value] of commands.entries()){
        list += "!"+key+" ";
    }
    message.channel.send("Image Commands: \n```" + list + "```");
}

function authorized(user){
    let users = textLoader.getJSON().authorizedUsers;
    let author = ""+user.id;
    return users.includes(author)
}

exports.updatecommand = function(message){
    console.log("Attempting update...");
    if(!authorized(message.author)) {
        console.log("User "+message.author.username+" not authorized.");
        return;
    }
    message.channel.send(textLoader.getJSON().flavorText.updateText);
    console.log("User "+message.author.username+" authorized. Running command \""+textLoader.getJSON().dynamicCommands.updateCommand+"\"");
    const { exec } = require('child_process');
    exec(textLoader.getJSON().dynamicCommands.updateCommand, (err, stdout, stderr) => {
        if (err) {
            message.channel.send(textLoader.getJSON().flavorText.serverStatusFailed);
            console.log(stderr);
            return;
        }
        message.channel.send( "```" + stdout + "```");
    });
}