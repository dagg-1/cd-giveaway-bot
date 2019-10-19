const Discord = require('discord.js');
const token_file = require('./tokens.json')

const client = new Discord.Client();
const prefix = "!";

var gameTitles = [];
var giveawayTime = 0;
var channelId = "";
var gameKeys = [];

client.on('ready', () => {
    console.log(`Logged in successfully as ${client.user.tag}`);
});

// !create [number of items] [name] [time] [channel] [key] 

client.on('message', msg => {

    const filter = (reaction, user) => {
        return ['🎉', '🚫', '✅'].includes(reaction.emoji.name) && user.id === msg.author.id;
    };

    console.log(`[${new Date().toLocaleTimeString()}] ${msg.author.tag}: ${msg.content}`);
    const arguments = msg.content.slice(prefix.length).trim().split(" ");
    const command = arguments.shift();
    switch (command) {
        case "create":
            var count = parseInt(arguments[0]);

            // Written by Nyx <3 and Dagg <:DogeWtf:586419821986578433> 🎉

            // Parse data
            gameTitles = arguments.slice(1, count + 1);
            giveawayTime = arguments[count + 1];
            channelId = arguments[count + 2];
            gameKeys = arguments.slice(arguments.length - count, (arguments.length));

            // Get a new date and place the giveawayTime variable into an array to be examined later
            let sepTime = giveawayTime.split(/(\d+)/);
            let endDate = new Date();
            let currDate = new Date();

            // Assemble the embed
            let CreEmbed = new Discord.RichEmbed()
                .addField("Games", count)
                .addField("Channel", channelId)
                .setColor(Math.floor(Math.random() * 16777215))
                .setFooter(new Date().toUTCString())
                .setAuthor(`${msg.author.tag}`, msg.author.avatarURL);

            // Determine the end date
            switch (sepTime[2]) {
                case "m":
                    endDate.setUTCMinutes(endDate.getUTCMinutes() + parseInt(sepTime[1]));
                    break
                case "h":
                    endDate.setUTCHours(endDate.getUTCHours() + parseInt(sepTime[1]));
                    break
                case "d":
                    endDate.setUTCDate(endDate.getUTCDate() + parseInt(sepTime[1]));
                    break
                case "w":
                    endDate.setUTCDate(endDate.getUTCDate() + (7 * parseInt(sepTime[1])));
                    break
                case "y":
                    endDate.setUTCFullYear(endDate.getUTCFullYear() + parseInt(sepTime[1]));
                    break
            };
            CreEmbed.addField("End Date", endDate.toUTCString());

            // Add the games to the embed fields
            var i = 1;
            gameTitles.forEach(element => {
                let split = element.replace(/-/gi, " ");
                CreEmbed.addField(split, "IF THIS IS BLANK, THERE HAS BEEN A FATAL ERROR");
                ++i;
            });
            i = 1;
            gameKeys.forEach(element => {
                CreEmbed.fields[i + 2] = { name: CreEmbed.fields[i + 2].name, value: element, inline: false };
                ++i;
            });

            // Post the message
            msg.channel.send(CreEmbed)
                .then(async newmsg => {
                    newmsg.createReactionCollector(filter, { time: 120000 })
                        .on('collect', reaction => {
                            switch (reaction.emoji.name) {

                            }
                        })
                    await newmsg.react("✅")
                    await newmsg.react("🚫")
                }); // TODO: Add reaction control for finalisation
            break
    }
});

client.login(token_file.discord.bot_token);

/*
let usermap = reaction.users.entries()
usermap.next()
console.log(`I collected a reaction, it's name is ${reaction.emoji.name} and it was from ${usermap.next().value[1].tag}`)

let aoNow = new Date()
                console.log(`END DATE: ${endDate} \n CURRENT DATE: ${aoNow}`)
                let thisInterval = setInterval(() => {
                    aoNow = new Date()
                    console.log(`END DATE: ${endDate} \n CURRENT DATE: ${aoNow}`)
                    if (endDate <= aoNow) {
                        newmsg.edit(Math.floor(Math.random() * 100))
                        clearInterval(thisInterval)
                    }
                }, 60000) // TODO: Update the final giveaway message (not this one) every minute for hours remaining
                // 60000ms should make it repeat every minute at the minimum time
*/