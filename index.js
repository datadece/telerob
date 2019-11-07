const TelegramBot = require('node-telegram-bot-api');// set-up telegram api
const fs = require('fs');//read file
const https = require("https");



require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
   
var words = require("./curses.txt");//get list of a blocked words
var welcomemsg = require("./welcome.txt");//get list of a blocked words

var token = 'Your-TokenHere';//the token of the bot

var opt = {polling: true};

var bot = new TelegramBot(token , opt);//create the bot

console.clear();
console.log('\x1b[31m%s\x1b[0m', welcomemsg + '\x1b[33mBy DataDece\x1b[0m', "v.2.7.4\n"); 



bot.on('message', function (msg) { //when the bot gets a new message he should do:
    if(typeof(msg.text) !== 'undefined'){
    var wordsplit = msg.text.split(' ');
    var badcount = 0;
    var id = msg.chat.id;
    var wordlist = words.split(' ');
    
        console.log('\x1b[31m%s\x1b[0m', msg.chat.username + ' >> ' + '\x1b[33m'+ msg.from.first_name + ' [ ' + msg.from.username + ' ] : ' + '\x1b[0m'); 
        console.log(msg.text + '\n');
    

    for(i=0;i<wordsplit.length;i++){
        for(j=0;j<wordlist.length;j++){
            if(wordsplit[i] == wordlist[j]){
               badcount+=1;
            }
        }
    }

    if(badcount>0){
        bot.sendMessage(id,msg.from.first_name + " , Please act properly and do not curse");  
        if(msg.chat.type=="supergroup"){
            bot.deleteMessage(msg.chat.id, msg.message_id);
        }
    }

    if(msg.text.startsWith('ip ') == true){
        let ip = msg.text.split(' ')[1];
        let ipurl = "https://api.ipgeolocation.io/ipgeo?apiKey=7671dd88920d42d28c7ede3d43080576&ip=" + ip;
        https.get(ipurl, (res) => {
            res.on('data', (d) => {
                bot.sendMessage(id, 'ip: ' + JSON.parse(d).ip + '\n' + 'continent: ' + JSON.parse(d).continent_name + '\n' + 'country: ' + JSON.parse(d).country_name + '\n' + 'isp: ' + JSON.parse(d).isp + ' - ' + JSON.parse(d).organization);  
            });
      
            }).on('error', (e) => {
                null;
            });
        
    }

}
    

});

bot.on("photo", function(msg){
    if(typeof(msg.photo) != 'undefined'){
    const file = msg.photo[msg.photo.length-1];
    const apiURL = 'https://api.telegram.org/';
    const botURL = apiURL + 'bot' + token + '/';
    const file_url = botURL + 'getFile?file_id=' + file.file_id;
    
    
    https.get(file_url, (res) => {
        res.on('data', (d) => {
            let download_file = ("https://api.telegram.org/file/bot"+ token + "/" + JSON.parse(d).result.file_path);
            
            const imgur = require('imgur');

            imgur.uploadUrl(download_file)
            .then(function (json) {
                console.log('\x1b[31m%s\x1b[0m', msg.chat.username + ' >> ' + '\x1b[33m'+ msg.from.first_name + ' [ ' + msg.from.username + ' ] : ' + '\x1b[0m'); 
                console.log("IMAGE : [ " + json.data.link + " ]\n");
            })

            .catch(function (err) {
                console.error(err.message);
            });


        });
  
        }).on('error', (e) => {
            null;
        });
    }

   
});



bot.on("error", function(msg){
    null
});

bot.on("polling_error", function(msg){
    null;
})

//גַּ֤ם כִּֽי אֵלֵ֨ךְ בְּגֵ֪יא צַלְמָ֡וֶת לֹא אִ֮ירָ֤א רָ֗ע כִּי אַתָּ֥ה עִמָּדִ֑י'