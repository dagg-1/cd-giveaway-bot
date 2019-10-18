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
            var count = parseInt(arguments[0]);
            
            // Written by Nyx <3 and Dagg :DogeWtf: 🎉

            // Parse data
            gameTitles = arguments.slice(1, count+1);
            giveawayTime = arguments[count + 1];
            channelId = arguments[count + 2];
            gameKeys = arguments.slice(arguments.length-count, (arguments.length))

            let sepTime = giveawayTime.split(/(\d+)/);
            let date = new Date()

            

            let CreEmbed = new Discord.RichEmbed()
            .addField("Games", count)
            .addField("Channel", channelId)
            .setColor(Math.floor(Math.random() * 16777215))
            .setFooter(new Date().toUTCString())
            .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.avatarURL)

            switch (sepTime[2]) {
                case "m":
                    date.setUTCMinutes(date.getUTCMinutes() + parseInt(sepTime[1]))
                    break
                case "h":
                    date.setUTCHours(date.getUTCHours() + parseInt(sepTime[1]))
                    break
                case "d":
                    date.setUTCDate(date.getUTCDate() + parseInt(sepTime[1]))
                    break
                case "w":
                    date.setUTCDate(date.getUTCDate() + (7 * parseInt(sepTime[1])))
                    break
                case "y":
                    date.setUTCFullYear(date.getUTCFullYear() + parseInt(sepTime[1]))
                    break
            }
            CreEmbed.addField("End Date", date.toUTCString())

            var i = 1;
            gameTitles.forEach(element => {
                let split = element.replace(/-/gi, " ")
                CreEmbed.addField(`Game #${i}`, split);
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