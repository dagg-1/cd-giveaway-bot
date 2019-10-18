const Discord = require('discord.js');
const token_file = require('./tokens.json')

const client = new Discord.Client();
const prefix = "!";

var gameTitles = [];
var giveawayTime = 0;
var channelId = "";
var gameKeys = [];

client.on('ready', () => {
    console.log(`Logged in successfully as ${client.user.username}#${client.user.discriminator}`);
});

// !create [number of items] [name] [time] [channel] [key] 

client.on('message', msg => {
    console.log(msg.content);
    const arguments = msg.content.slice(prefix.length).trim().split(" ");
    const command = arguments.shift();
    switch (command) {
        case "create":
            var count = arguments[0];
            var convcount = parseInt(count, 36);
            
            // Written by Nyx <3 and Dagg :DogeWtf: 🎉

            // Parse data
            gameTitles = arguments.slice(1, convcount+1);
            giveawayTime = arguments[convcount + 1];
            channelId = arguments[convcount + 2];
            gameKeys = arguments.slice(arguments.length-convcount, (arguments.length))

            let sepTime = giveawayTime.split(/(\d+)/);
            
            switch (sepTime[3]) {
                case "m":
                    break
                case "h":
                    break
                case "d":
                    break
                case "m":
                    break
            }

            let CreEmbed = new Discord.RichEmbed()
            .addField("Games", count)
            .addField("Time", giveawayTime)
            .addField("Channel", channelId)
            .setColor(Math.floor(Math.random() * 16777215))
            .setFooter(new Date().toUTCString())

            var i = 1;
            gameTitles.forEach(element => {
                CreEmbed.addField(`Game #${i}`, element);
                ++i;
            })
            i = 1;
            gameKeys.forEach(element => {
                CreEmbed.addField(`Game #${i} Key`, element);
                ++i;
            })


            msg.channel.send(CreEmbed)
            break
    }
});

client.login(token_file.discord.bot_token)