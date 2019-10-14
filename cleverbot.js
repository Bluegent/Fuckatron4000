const https = require('https');
var textLoader = require('./textLoader.js');

function getInsult(){
  
}


//mentionEvent
exports.mentionEvent = function (message, client) {
  if (message.isMentioned(client.users.get("603095851195432961"))) {
      var replies = textLoader.mentionReplies();
     
    https.get('https://evilinsult.com/generate_insult.php?lang=en&type=json', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      var insult = JSON.parse(data).insult;
      var tag = message.author.id;
      if(insult != null)
        message.channel.send("<@"+tag+"> "+insult);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
  }
}