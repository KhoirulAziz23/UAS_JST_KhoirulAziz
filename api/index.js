var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1809296672:AAGh81AFbdiKC8kLRt8XKHgIn_C4O9oy214'
const bot = new TelegramBot(token, {polling: true});


// Main Menu bots
bot.onText(/\/start/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        click /predict`
    );   
});

// input requires x,y,z
state = 0;
bot.onText(/\/predict/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        'Masukan Nilai X|Y|Z , contoh 39.588|-33.474|-220.645'
    );
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        x = s[0]
        y = s[1]
        z = s[2]
        model.predict(
            [
                parseFloat(s[0]), //string to float
                parseFloat(s[1]),
                parseFloat(s[2])
            ]
       ).then((jres)=>{
            bot.sendMessage(
                msg.chat.id,
                `Nilai M1 yang Di Prediksi adalah ${jres[0]}`
            );
            
            bot.sendMessage(
                msg.chat.id,
                `Nilai M2 yang Di Prediksi adalah ${jres[1]}`
            );
            
            
            bot.sendMessage(
                msg.chat.id,
                `Nilai M3 yang Di Prediksi adalah ${jres[2]}`
            );
        })
    }else{
        state = 0
    }
})

// routers
r.get('/prediction/:x/:y/:z', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.x), // string to float
            parseFloat(req.params.y),
            parseFloat(req.params.z)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

module.exports = r;
