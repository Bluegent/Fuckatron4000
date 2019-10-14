

var verbT = "@verb";
var gerundT = "@gerund";
var doerT = "@er";
var nounT = "@noun";
var locationT = "@location";
var tagT= ">>tag";
var adjectiveT = "@adjective";
var associateT = "@assoc";


var nounArr = ["fart","cum","shit","dick","anus"];
var verbArr = ["smell","drink","slurp","gargle","love","sniff","suck","steal"];
var locationArr = ["in hell","in their mother's basement","in a "+ adjectiveT+" bar","behind the Kaufland store","in their boss' office"];
var associateArr = ["goblin","associate","enthusiast","thief","bastard"];
var adjectiveArr = ["crusty","smelly","nasty","decrepit","ancient","old","deadly","dank"];
var insultTemplates = [];

exports.initTemplates = function(){
    insultTemplates.push(tagT+" is a "+nounT+" "+gerundT+"-"+nounT+" "+doerT+".");
    insultTemplates.push(tagT+" "+verbT+"s " +nounT+" "+ locationT+".");
    insultTemplates.push(tagT+" is a "+adjectiveT+" "+nounT+" "+associateT+".");
}

function ran(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
function ranS(strings){
    return strings[ran(strings.length)];
}

function endsWithVowel(string){
    var lower = string.toLowerCase();
    return lower.endsWith("a") || lower.endsWith("e") || lower.endsWith("i") || lower.endsWith("o")   || lower.endsWith("u");
}

function removeLastVowel(string){
    if(endsWithVowel(string)){
        return string.substring(0,string.length-1);
    } else {
        return string;
    }
}

function getRandomGerund(){
    return removeLastVowel(ranS(verbArr))+"ing";
}

function getRandomDoer(){
    return removeLastVowel(ranS(verbArr))+"er";
}

function getRandomVerb(){
    return ranS(verbArr);
}
function getRandomNoun(){
    return ranS(nounArr);
}
function getRandomLocation(){
    return ranS(locationArr);
}

function getRandomAdjective(){
    return ranS(adjectiveArr);
}
function getRandomAssociate(){
    return ranS(associateArr);
}

function replaceTags(string){
    var copy = string.replace(verbT,getRandomVerb());
    copy = copy.replace(nounT,getRandomNoun());
    copy = copy.replace(locationT,getRandomLocation());
    copy = copy.replace(adjectiveT,getRandomAdjective());
    copy = copy.replace(doerT,getRandomDoer());
    copy = copy.replace(gerundT,getRandomGerund());
    copy = copy.replace(associateT,getRandomAssociate());
    return copy
}

function containsTag(string){
    return string.includes("@");
}

function recursiveReplace(string,tag){
    var copy = string;
    
    while(containsTag(copy))
    {
        copy = replaceTags(copy);
    }
    copy = copy.replace(tagT,tag);
    return copy;
}



exports.getInsulted = function(tag){
    var temp = ranS(insultTemplates);
    return recursiveReplace(temp,tag);
}

