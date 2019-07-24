var utils = require('./utils.js');
var textLoader = require('./textLoader.js');
const exec = require('child_process');

exports.commandsCommand = function (message) {
    var command_list = "";
    var commands = textLoader.getJSON().commands;
    for (var i = 0; i < commands.length; ++i) {
        command_list += "!" + commands[i] + " ";
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


function executeCommandSync(command) {
    var err_flag = false;
    try {
        var res = exec.execSync(command, { stdio: 'pipe' }).toString();
        return [err_flag, res];
    } catch (error) {
        err_flag = true;
        var err_out = error.stderr.toString();
        return [err_flag, err_out];
    }
}

function getServerStatus(address) {
    return executeCommandSync('mcstatus ' + address + ' status');
}

function getRightFromChar(string, char) {
    if(!string.includes(char))
        return "";
    return string.substring(string.indexOf(char), string.length - 1);
}

function getLeftFromChar(string, char) {
    if(!string.includes(char))
        return "";
    return string.substring(0, string.indexOf(char) - 1);
}

function outputStatusResult(address, msg, client) {
    var result = getServerStatus(address);
    if (result[0] === true) {
        if (result[1].includes("timed out")) {
            msg.channel.send(textLoader.getJSON().flavorText.serverStatusOffline + utils.getEmoji(client, "sad").toString());
        } else {
            msg.channel.send(textLoader.getJSON().flavorText.serverStatusFailed);
        }
    } else {
        var message = "Server is online.\n";
        var lines = result[1].split("\n");
        message += lines[0]+"\n";

        var desc = getRightFromChar(lines[1]," ").replace("\"", "").split(":")[1].replace(/\{|\}/,"");
        message +=  "description: " + desc.trim()+ "\n";
        
        var playerInfo = getRightFromChar(lines[2]," ").replace(/\[|\]|\'/,"").trim();

        console.log("playerinfo: "+ playerInfo);
        message += "players: " + playerInfo.split(" ")[1]+"\n";

        if (!playerInfo.startsWith('0')) {
            var players = getRightFromChar(playerInfo," ");
            var playersList = players.split(", ");
            for(var i = 0; i < players.length; ++i){
                playersList+= getLeftFromChar(players[i]," ")+" ";
                console.log(playersList);
            }
            message+= playersList;
        }
        msg.channel.send("```" + message + "```");
    }
}

exports.statusCommand = function (message, args, client) {
    if (args[0] === undefined) {
        message.channel.send(textLoader.getJSON().descriptions[1]);
        return;
    }
    message.channel.send(textLoader.getJSON().flavorText.serverStatusWait);
    var server_addr = args[0];
    outputStatusResult(server_addr, message, client);
}

exports.serverCommand = function (message, args, client) {
    if (args[0] === undefined) {
        message.channel.send(textLoader.getJSON().flavorText.serverStatusWait);
        outputStatusResult(textLoader.getJSON().myServer, message, client);
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
    if (args[0] == undefined) {
        message.channel.send(textLoader.getJSON().descriptions[4]);
        return;
    }
    var address = args[0];
    var result = executeCommandSync(textLoader.getJSON().flavorText.pingCommand + address);
    if (result[0] === true) {
        message.channel.send(textLoader.getJSON().flavorText.serverStatusFailed);
        console.log(result[1]);
        return;
    }
    message.channel.send(textLoader.getJSON().flavorText.pingResponse + "```" + result[1] + "```");
}

exports.customImageCommand = function (message) {
    var command = message.content.split(' ')[0].replace('!', '');
    if (command == undefined) {
        wrongCommand(message);
    }
    if (textLoader.getImgCommands().has(command)) {
        message.channel.send(textLoader.getImgCommands().get(command));
    } else {
        wrongCommand(message);
    }
}

function checkURL(url) {
    return (url.match(/\.(jpeg|jpg|gif|png|mp4|webm|mkv)$/) != null && url.match(/^(http\:\/\/|https\:\/\/)/) != null);
}

exports.registerCommand = function (message, args) {
    var allowAll = true;
    let users = textLoader.getJSON().authorizedUsers;
    let author = "" + message.author.id;

    if (allowAll || users.includes(author)) {
        if (args[0] != undefined && args[1] != undefined && checkURL(args[1]) && !textLoader.getImgCommands().has(args[0]) && !textLoader.getJSON().commands.includes(args[0])) {
            textLoader.getImgCommands().set(args[0], args[1]);
            textLoader.exportImageCommands();
            message.channel.send(textLoader.getJSON().flavorText.registerComplete);
        }
        else {
            message.channel.send(textLoader.getJSON().descriptions[6]);
        }

    }
    else {
        message.channel.send(textLoader.getJSON().flavorText.registerWrongUser);
    }
}

exports.imageCommands = function (message) {
    var list = "";

    var commands = textLoader.getImgCommands();
    for (const [key, value] of commands.entries()) {
        list += "!" + key + " ";
    }
    message.channel.send("Image Commands: \n```" + list + "```");
}

function authorized(user) {
    let users = textLoader.getJSON().authorizedUsers;
    let author = "" + user.id;
    return users.includes(author)
}

exports.updatecommand = function (message) {
    console.log("Attempting update...");
    if (!authorized(message.author)) {
        console.log("User " + message.author.username + " not authorized.");
        return;
    }
    message.channel.send(textLoader.getJSON().flavorText.updateText);
    console.log("User " + message.author.username + " authorized. Running command \"" + textLoader.getJSON().dynamicCommands.updateCommand + "\"");

    var result = executeCommandSync(textLoader.getJSON().dynamicCommands.updateCommand);
    message.channel.send(textLoader.getJSON().flavorText.serverStatusFailed);
    if (result[0] === true) {
        message.channel.send(textLoader.getJSON().flavorText.serverStatusFailed);
        console.log(result[1]);
        return;
    }
}

exports.botStatusCommand = function (message) {
    const used = process.memoryUsage();
    let ramUsage = 0;
    let cpuUsage = utils.getCPUUSage();
    let now = new Date().getTime()
    let uptime = now - textLoader.getStartTime();
    let msg = "```";
    for (let key in used) {
        ramUsage += Math.round(used[key] / 1024 / 1024 * 100) / 100;
    }
    msg += "RAM Usage: " + Math.floor(ramUsage) + " MB \n";
    msg += "CPU Usage: " + cpuUsage + " % \n";
    msg += "Uptime: " + utils.secondsToString(Math.floor(uptime / 1000)) + "```";
    message.channel.send(msg);
}