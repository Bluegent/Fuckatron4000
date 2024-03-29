const fs = require('fs');


var startTime;
var mentionReplies = new Array();
var dynamicText = "";
var imageCommands = new Map();
exports.getStartTime =  function() { return startTime};


exports.getLastStartUplog = function(){
    console.log("Getting last startup log...");
    let data = undefined;
    try {
        data = fs.readFileSync('last_update.log');
    } catch (err) {
        console.log("Update log does not exist.");
        return data;
    }
    console.log("Log retrieved.");
    return data;
    
}

exports.loadImageCommands = function(){
    console.log("Loading immage commands...");
    let rawdata = fs.readFileSync('imageCommands.json');
    imageCommands = new Map();
    let commJson = JSON.parse(rawdata);;
    for(var command in commJson){
        imageCommands.set(command,commJson[command]);
    }
    delete rawdata;
    console.log("Loaded image commands.");
}

function mapToObj(map){
    return [...map].reduce((acc,val) => {
        acc[val[0]]=val[1];
        return acc;        
    }, {});
}

exports.exportImageCommands = function() {
    console.log("Write image commands to file...");
    fs.writeFile('imageCommands.json', JSON.stringify(mapToObj(imageCommands)), (err) => {
        if (err) console.log(err);
        console.log("Successfully saved image commands.");
    });
}

exports.getImgCommands = function(){
    return imageCommands;
}

exports.getJSON = function(){
    return dynamicText;
}

exports.mentionReplies = function() {
    return mentionReplies;
}

exports.start = function() {
   startTime = new Date().getTime();
   prevUsage = process.cpuUsage();
   parseText();
}

function parseText() {
    console.log("Loading dynamic text from json...");
    let rawdata = fs.readFileSync('dynamicText.json');
    delete dynamicText;
    dynamicText = JSON.parse(rawdata);
    mentionReplies = [];
    for(var i = 0; i< dynamicText.mentionReplies.length; ++i){
        mentionReplies.push(dynamicText.mentionReplies[i]);
    }
    console.log("Mention replies number: "+mentionReplies.length);
    delete rawdata;
    //setInterval(parseText,30000);
    console.log("Dynamic text loaded.");
    
}


exports.rescan = parseText;