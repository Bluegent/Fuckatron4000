const https = require('https');
var textLoader = require('./textLoader.js');
var insults = require('./insults');
function getInsult(){
  
}


//mentionEvent
exports.mentionEvent = function (message, client) {
  if (message.isMentioned(client.users.get("603095851195432961"))) {     
      var tag = "<@"+message.author.id+">";
      var insult = insults.getInsulted(tag);
      if(insult != null)
        message.channel.send(insult);
  }
}
