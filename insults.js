

var verbT = "@verb";
var gerundT = "@gerund";
var doerT = "@er";
var nounT = "@noun";
var locationT = "@location";
var tagT= ">>tag";
var adjectiveT = "@adjective";
var associateT = "@assoc";
var containerT = "@contanier";

var nounArr = ["fart","cum","shit","dick","anus","penis","piss","poop","turd","crap","ballsack","puke","jizz", "period blood","fetus","diaper","ball"];
var verbArr = ["smell","drink","slurp","gargle","love","sniff","suck","steal","smuggle","kiss","munch","eat","swallow","feel","fondle","touch","hold","sell","lick"];
var locationArr = ["in hell","in their mother's basement","in a crusty bar","behind the Kaufland store","in their boss' office"];
var associateArr = ["goblin","associate","enthusiast","thief","bastard","asshole","midget","dwarf","zombie","monster","dweller","hobo","fag","admirer","whore","fan","rapist","merchant"];
var adjectiveArr = ["crusty","smelly","nasty","decrepit","ancient","old","deadly","dank","gay","hairy","crispy","flaccid","musty","crummy","sweaty"];
var containerArr = ["tub","bucket","box","room"];
var insultTemplates = [];

exports.initTemplates = function(){
    insultTemplates.push(tagT+" is a "+nounT+" "+gerundT+"-"+nounT+" "+doerT+".");
    insultTemplates.push(tagT+" is a "+nounT+" "+gerundT+"-"+nounT+" "+associateT+".");
    insultTemplates.push(tagT+" "+verbT+" " +nounT+" "+ locationT+".");
    insultTemplates.push(tagT+" "+verbT+" " +associateT+" "+nounT+".");
    insultTemplates.push(tagT+" is a "+adjectiveT+" "+nounT+" "+associateT+".");
    insultTemplates.push(tagT+" lives in a "+containerT+" filled with "+nounT+".");
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

function removeLastLetter(string){
    if(endsWithVowel(string)){
        return string.substring(0,string.length-1);
    } else {
        return string;
    }
}

function getRandomGerund(){
    return removeLastLetter(ranS(verbArr))+"ing";
}

function getRandomDoer(){
    return removeLastLetter(ranS(verbArr))+"er";
}

function getRandomVerb(){
    var verb = ranS(verbArr);
    var lower = verb.toLowerCase();
    if(lower.endsWith("s")){
        return verb+"es";
    }
    return verb+"s";
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
    copy = copy.replace(containerT,ranS(containerArr));
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

