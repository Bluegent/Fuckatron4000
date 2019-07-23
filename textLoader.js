const fs = require('fs');

var mentionReplies = new Array();
var dynamicText = "";

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
    delete fs;
    setInterval(parseText,30000);
    
}


