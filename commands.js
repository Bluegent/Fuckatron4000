var utils = require('./utils.js');
var textLoader = require('./textLoader.js');
const exec = require('child_process');


var commandMap = new Map();
var commandChar = "!";


//Utils
function getArgs(content) {
    var args = content.split(" ");
    args = args.splice(1);
    return args;
}


function getCommand(content) {
    return content.split(" ")[0].replace(commandChar, "").toLowerCase();
}

function getServerStatus(address) {
    return executeCommandSync('mcstatus ' + address + ' status');
}

function getRightFromChar(string, char) {
    if (!string.includes(char))
        return "";
    return string.substring(string.indexOf(char), string.length);
}

function getLeftFromChar(string, char) {
    if (!string.includes(char))
        return "";
    return string.substring(0, string.indexOf(char));
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

function parseMcstatusOutput(output) {
    var message = "Server is online.\n";
    var lines = output.split("\n");
    message += lines[0] + "\n";

    var desc = getRightFromChar(lines[1], " ").replace("\"", "").split(":")[1].replace(/\{|\}/, "");
    message += "description: " + desc.trim() + "\n";

    var playerInfo = getRightFromChar(lines[2], " ").replace(/\[|\]|\'/, "").trim();
    message += "players: " + playerInfo.split(" ")[0];

    if (!playerInfo.startsWith("0")) {
        message += " ( ";
        var players = getRightFromChar(playerInfo, " ");
        var playersList = players.split(",");
        players = "";
        for (var i = 0; i < playersList.length; ++i) {
            var player = playersList[i].trim().replace("'", "");
            players += getLeftFromChar(player, " ") + " ";
        }
        message += players + ")";
    }
    return message;
}

function checkURL(url) {
    return (url.match(/\.(jpeg|jpg|gif|png|mp4|webm|mkv)$/) != null && url.match(/^(http\:\/\/|https\:\/\/)/) != null);
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

function executeCommandAsync(command) {
    //TODO:
}


function authorized(user) {
    let users = textLoader.getJSON().authorizedUsers;
    let author = "" + user.id;
    return users.includes(author)
}

//Startup stuff
exports.mapCommands = function () {
    console.log("Mapping commands...");
    commandChar = textLoader.getJSON().commandCharacter;
    var commands = textLoader.getJSON().commands;
    for (var index = 0; index < commands.length; ++index) {
        var commandText = commands[index].command;
        var commandDesc = commands[index].desc.replace("$command$", commandChar + commandText);
        commandMap.set(commandText, { description: commandDesc, func: null });
    }
    commandMap.get("help").func = helpCommand;
    commandMap.get("dice").func = diceCommand;
    commandMap.get("commands").func = commandsCommand;
    commandMap.get("status").func = statusCommand;
    commandMap.get("server").func = serverCommand;
    commandMap.get("purpose").func = purposeCommand;
    commandMap.get("choose").func = chooseCommand;
    commandMap.get("ping").func = pingCommand;
    commandMap.get("registermeme").func = registerCommand;
    commandMap.get("memecommands").func = memeCommands;
    commandMap.get("update").func = updateCommand;
    commandMap.get("botstatus").func = botStatusCommand;
    commandMap.get("cmd").func = cmdCommand;

    console.log("All commands mapped.");
}

//onMessage
exports.onMessage = function (message, client) {
    if (!message.content.startsWith(commandChar))
        return;
    console.log("Commands.onMessage:" + message.content.substr(0, 255) + "...")
    var command = commandMap.get(getCommand(message.content));
    if (command !== undefined && typeof command.func === 'function') {
        command.func(message, client);
    } else {
        customMemeCommand(message, client);
    }
}

//mentionEvent
exports.mentionEvent = function (message, client) {
    if (message.isMentioned(client.users.get("603095851195432961"))) {
        var replies = textLoader.mentionReplies();
        message.channel.send(utils.getRandomValue(replies));
    }
}

//custom meme command
function customMemeCommand(message, client) {

    if (message.content.includes(commandChar)) {
        var command = message.content.split(' ')[0].replace(commandChar, '');
        if (textLoader.getImgCommands().has(command)) {
            message.channel.send(textLoader.getImgCommands().get(command));
        }
    }
}

//Command functions

function commandsCommand(message, client) {
    var command_list = "";
    var commands = textLoader.getJSON().commands;
    commandMap.forEach(function (value, key, map) {
        command_list += commandChar + key + " ";
    })
    message.channel.send("Commands: \n```" + command_list + "```");
}

function helpCommand(message, client) {
    var args = getArgs(message.content);
    if (args[0] === undefined) {
        message.channel.send(commandMap.get("help").description);
    } else {
        var command = commandMap.get(args[0]);
        if (command !== undefined && command.description !== undefined)
            message.channel.send(command.description);
    }
}

function diceCommand(message, client) {
    var args = getArgs(message.content);
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

function outputStatusResult(address, msg, client) {
    var result = getServerStatus(address);
    if (result[0] === true) {
        if (result[1].includes("timed out")) {
            msg.channel.send(textLoader.getJSON().flavorText.serverStatusOffline + utils.getEmoji(client, "sad").toString());
        } else {
            msg.channel.send(textLoader.getJSON().flavorText.serverStatusFailed);
        }
    } else {
        var message = parseMcstatusOutput(result[1]);
        msg.channel.send("```" + message + "```");
    }
}

function statusCommand(message, client) {
    var args = getArgs(message.content);
    if (args[0] === undefined) {
        message.channel.send(textLoader.getJSON().descriptions[1]);
        return;
    }
    message.channel.send(textLoader.getJSON().flavorText.serverStatusWait);
    var server_addr = args[0];
    outputStatusResult(server_addr, message, client);
}

function serverCommand(message, client) {
    var args = getArgs(message.content);
    if (args[0] === undefined) {
        message.channel.send(textLoader.getJSON().flavorText.serverStatusWait);
        outputStatusResult(textLoader.getJSON().myServer, message, client);
    }
    else if (args[0] == "help")
        message.channel.send(textLoader.getJSON().descriptions[3]);
}

function purposeCommand(message, client) {
    message.channel.send(utils.getRandomValue(textLoader.getJSON().miscTextBits.purpose));
}

function chooseCommand(message, client) {
    var args = getArgs(message.content);
    if (args[0] == undefined) {
        message.channel.send(textLoader.getJSON().descriptions[4]);
        return;
    }
    message.channel.send(args[utils.getRandomInt(args.length)]);
}

function pingCommand(message, client) {
    var args = getArgs(message.content);
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



function registerCommand(message, client) {
    var allowAll = true;
    var args = getArgs(message.content);
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

function memeCommands(message, client) {
    var list = "";

    var commands = textLoader.getImgCommands();
    for (const [key, value] of commands.entries()) {
        list += commandChar + key + " ";
    }
    message.channel.send("Image Commands(case sensitive!): \n```" + list + "```");
}

function updateCommand(message, client) {
    console.log("Attempting update...");
    if (!authorized(message.author)) {
        console.log("User " + message.author.username + " not authorized.");
        return;
    }
    message.channel.send(textLoader.getJSON().flavorText.updateText);

    var command = textLoader.getJSON().dynamicCommands.updateCommandPart1 + `${process.pid}` + textLoader.getJSON().dynamicCommands.updatecommandPart2;
    console.log("User " + message.author.username + " authorized. Running command \"" + command + "\"");

    var result = executeCommandSync(command);
    message.channel.send(textLoader.getJSON().flavorText.serverStatusFailed);
    if (result[0] === true) {
        message.channel.send(textLoader.getJSON().flavorText.serverStatusFailed);
        console.log(result[1]);
        return;
    }
}

function botStatusCommand(message, client) {
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
    msg += "Uptime: " + utils.secondsToString(Math.floor(uptime / 1000)) + "\n";
    msg += "PID: " + `${process.pid}`;
    msg += "```";
    message.channel.send(msg);
}

function cmdCommand(message, client) {
    console.log("Attempting cmd...");
    if (!authorized(message.author)) {
        console.log("User " + message.author.username + " not authorized.");
        return;
    }
    var command = getRightFromChar(message.content, " ").trim();
    console.log("User " + message.author.username + " authorized. Running command \"" + command + "\"");

    var result = executeCommandSync(command);
    var cmdResult = result[1].substring(0, 1500);
    if (cmdResult.length > 1500)
        cmdResult += "[...]";
    var channel = client.channels.find(channel => channel.name == "bot-test");
    if(cmdResult.length = 0)
        channel.send("Executed with no output.")
    else
        channel.send("Output: ```" + cmdResult + "```");
}