const fs = require('fs');

var mentionReplies = new Array();
var dynamicText = "";
var imageCommands = new Map();

exports.loadImageCommands = function(){
    let rawdata = fs.readFileSync('imageCommands.json');
    imageCommands = new Map();
    let commJson = JSON.parse(rawdata);;
    for(var command in commJson){
        imageCommands.set(command,commJson[command]);
    }
    delete rawdata;
}

function mapToObj(map){
    return [...map].reduce((acc,val) => {
        acc[val[0]]=val[1];
        return acc;        
    }, {});
}

exports.exportImageCommands = function() {
    
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

var test = "";
exports.test = function(){
    return test;
}

exports.start = function() {
   parseText();
}

function parseText() {
    let rawdata = fs.readFileSync('dynamicText.json');
    delete dynamicText;
    dynamicText = JSON.parse(rawdata);
    mentionReplies = [];
    for(var i = 0; i< dynamicText.mentionReplies.length; ++i){
        mentionReplies.push(dynamicText.mentionReplies[i]);
    }
    delete rawdata;
    setInterval(parseText,30000);
    
}


