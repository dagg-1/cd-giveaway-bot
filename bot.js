// Written by Nyx <3 and Dagg <:DogeWtf:586419821986578433> 🎉

const Discord = require('discord.js');
const token_file = require('./tokens.json');

const client = new Discord.Client();
const prefix = "!";

client.on('ready', () => {
    console.log(`Logged in successfully as ${client.user.tag}`);
});

// !create [number of items] [game-name-with-hypens-for-spaces] [time (4d for 4 days)] [#channel] [key(s)] 

client.on('message', msg => {
    if (msg.author.bot || !msg.channel.guild) return;

    let gameTitles = [];
    let giveawayTime = 0;
    let channelId = "";
    let gameKeys = [];

    const filter = (reaction, user) => {
        return ['🚫', '✅'].includes(reaction.emoji.name) && user.id === msg.author.id;
    };
    const givFilter = (reaction) => {
        return ['🎉'].includes(reaction.emoji.name);
    };

    const arguments = msg.content.slice(prefix.length).trim().split(" ");
    const command = arguments.shift();
    switch (command) {
        case "create":
            let count = parseInt(arguments[0]);
            if (!msg.guild.me.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("I don't have permissions to manage reactions! (Manage Messages)");
            if (!arguments[0] || !arguments[4] || !arguments[2 + (count * 2)] || arguments[3 + (count * 2)] || arguments[arguments.length - 1] > 22)
                return msg.channel.send("USAGE: !create [Number of Games] [game-name-with-hypens-for-spaces] [Time (10s | 20m | 30h | 40d | 50m)] [#channel] [key]\nThis bulk giveaway bot cannot handle over **22** games, watch your count!");

            // Parse data
            gameTitles = arguments.slice(1, count + 1);
            giveawayTime = arguments[count + 1];
            channelId = arguments[count + 2];
            gameKeys = arguments.slice(arguments.length - count, (arguments.length));

            // Begin checking if the recieved data is valid
            let slicedCId = channelId.replace(/<|#|>/g, "");
            if (client.channels.get(slicedCId) == undefined)
                return msg.channel.send("Invalid channel\nUSAGE: !create [Number of Games] [game-name-with-hypens-for-spaces] [Time (10s | 20m | 30h | 40d | 50m)] [#channel] [key]\nThis bulk giveaway bot cannot handle over **22** games, watch your count!");

            let sepTime = giveawayTime.split(/(\d+)/);
            if (sepTime.length !== 3)
                return msg.channel.send("Invalid duration\nUSAGE: !create [Number of Games] [game-name-with-hypens-for-spaces] [Time (10s | 20m | 30h | 40d | 50m)] [#channel] [key]\nThis bulk giveaway bot cannot handle over **22** games, watch your count!");
            // End checking

            // Assemble the embed
            let CreEmbed = new Discord.RichEmbed()
                .addField("Games", count)
                .addField("Channel", channelId)
                .setColor(Math.floor(Math.random() * 16777215))
                .setFooter(new Date().toUTCString())
                .addField("Duration", giveawayTime)
                .setAuthor(`${msg.author.tag}`, msg.author.avatarURL);

            // Add the games to the embed fields
            let i = 1;
            gameTitles.forEach(element => {
                let split = element.replace(/-/gi, " ");
                CreEmbed.addField(split, "Waiting");
                ++i;
            });
            i = 1;
            gameKeys.forEach(element => {
                CreEmbed.fields[i + 2] = { name: CreEmbed.fields[i + 2].name, value: element, inline: true };
                ++i;
            });

            // Post the message
            msg.channel.send(CreEmbed)
                .then(async newmsg => {
                    newmsg.createReactionCollector(filter, { time: 120000 })
                        .on('collect', reaction => {
                            switch (reaction.emoji.name) {
                                case "✅":
                                    newmsg.delete();
                                    let givEmbed = new Discord.RichEmbed()
                                        .setTitle("Giveaway Started! Click the 🎉 below to enter!")
                                        .addField("Games", count)
                                        .addField("Duration", giveawayTime, true)
                                        .setColor("#00FF00")
                                        .setFooter(new Date().toUTCString())
                                        .setAuthor(`${msg.author.tag}`, msg.author.avatarURL);
                                    i = 1;
                                    gameTitles.forEach(element => {
                                        let split = element.replace(/-/gi, " ");
                                        givEmbed.addField(`Game #${i}`, split, true);
                                        ++i;
                                    });
                                    // Determine the end date
                                    let endDate = new Date();
                                    switch (sepTime[2]) {
                                        case "s":
                                            endDate.setUTCSeconds(endDate.getUTCSeconds() + parseInt(sepTime[1]));
                                            break
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
                                    givEmbed.addField("End Date", endDate.toUTCString());
                                    client.channels.get(slicedCId).send(givEmbed).then(async anNewMsg => {
                                        let aoNow = new Date();
                                        let arrEntries;
                                        anNewMsg.createReactionCollector(givFilter, { time: endDate.getTime() - aoNow.getTime() })
                                            .on("end", reaction => {
                                                arrEntries = reaction.get("🎉").users.array();
                                            });
                                        let thisInterval = setInterval(() => {
                                            aoNow = new Date();
                                            if (endDate <= aoNow) {
                                                let keynum = 0;
                                                gameKeys.forEach(async element => {
                                                    let winnerObj;
                                                    let winner;
                                                    roll();
                                                    function roll() {
                                                        winner = Math.floor(Math.random() * (arrEntries.length - 1) + 1);
                                                        console.log(`WINNER: ${arrEntries[winner].tag}`);
                                                        winnerObj = client.users.get(arrEntries[winner].id);
                                                        winnerObj.send(`You won! Here's your key: ${element}`).catch(() => { client.channels.get(slicedCId).send(`<@${arrEntries[winner].id}> has their DMs disabled! Re-rolling`); roll(); });
                                                        givEmbed.fields[keynum+2].name = givEmbed.fields[keynum+2].value
                                                        givEmbed.fields[keynum+2].value = `WINNER: <@${winnerObj.id}>`
                                                        if(arrEntries.length > gameKeys.length) arrEntries.splice(winner, 1)
                                                        ++keynum
                                                    };
                                                });
                                                givEmbed.setColor("#FF0000")
                                                givEmbed.setTitle("Giveaway Ended! Enjoy the games!")
                                                anNewMsg.edit(givEmbed);
                                                clearInterval(thisInterval);
                                            };
                                        }, endDate.getTime() - aoNow.getTime());
                                        await anNewMsg.react("🎉");
                                    }).catch(() => {
                                        msg.channel.send("I cannot post in this channel!");
                                    });
                                    break
                                case "🚫":
                                    newmsg.delete();
                                    msg.channel.send("Successfully cancelled.");
                                    break
                            };
                        })
                    await newmsg.react("✅");
                    await newmsg.react("🚫").catch(() => console.log(`🚫 (NO_ENTRY EMOJI) failed to react, this is a common "issue" and you can ignore it.`));
                });
            break
    }
});

client.login(token_file.discord.bot_token);