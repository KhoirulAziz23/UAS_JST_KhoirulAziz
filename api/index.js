var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1898140927:AAF5Bu-mp6I_U-Q1h94xiGE7waSYuYj0FhI'
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
        'Masukan Nilai X1|X2|X3 , contoh 23.967|-31.948|-260.135'
    );
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        x1 = s[0]
        x2 = s[1]
        x3 = s[2]
        model.predict(
            [
                parseFloat(s[0]), //string to float
                parseFloat(s[1]),
                parseFloat(s[2])
            ]
       ).then((jres)=>{
            bot.sendMessage(
                msg.chat.id,
                `Nilai y1 yang Di Prediksi adalah ${jres[0]}`
            );
            
            bot.sendMessage(
                msg.chat.id,
                `Nilai y2 yang Di Prediksi adalah ${jres[1]}`
            );
            
            
            bot.sendMessage(
                msg.chat.id,
                `Nilai y3 yang Di Prediksi adalah ${jres[2]}`
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
            parseFloat(req.params.x1), // string to float
            parseFloat(req.params.x2),
            parseFloat(req.params.x3z)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

module.exports = r;
