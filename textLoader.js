const fs = require('fs');

var mentionReplies = new Array();

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
    let mentions = JSON.parse(rawdata);

    for(var i = 0; i< mentions.mentionReplies.length; ++i){
        mentionReplies.push(mentions.mentionReplies[i]);
    }
    setInterval(parseText,5000);
}


