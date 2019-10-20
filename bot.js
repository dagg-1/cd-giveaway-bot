const Discord = require('discord.js');
const token_file = require('./tokens.json')

const client = new Discord.Client();
const prefix = "!";

client.on('ready', () => {
    console.log(`Logged in successfully as ${client.user.tag}`);
});

// !create [number of items] [game-name-with-hypens-for-spaces] [time (4d for 4 days)] [#channel] [key(s)] 

client.on('message', msg => {

    let gameTitles = [];
    let giveawayTime = 0;
    let channelId = "";
    let gameKeys = [];

    const filter = (reaction, user) => {
        return ['🚫', '✅'].includes(reaction.emoji.name) && user.id === msg.author.id;
    };
    const givFilter = (reaction, user) => {
        return ['🎉'].includes(reaction.emoji.name)
    };

    console.log(`[${new Date().toLocaleTimeString()}] ${msg.author.tag}: ${msg.content}`);
    const arguments = msg.content.slice(prefix.length).trim().split(" ");
    const command = arguments.shift();
    switch (command) {
        case "create":
            let count = parseInt(arguments[0]);

            // Written by Nyx <3 and Dagg <:DogeWtf:586419821986578433> 🎉

            // Parse data
            gameTitles = arguments.slice(1, count + 1);
            giveawayTime = arguments[count + 1];
            channelId = arguments[count + 2];
            gameKeys = arguments.slice(arguments.length - count, (arguments.length));

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
                CreEmbed.fields[i + 2] = { name: CreEmbed.fields[i + 2].name, value: element, inline: false };
                ++i;
            });

            // Post the message
            msg.channel.send(CreEmbed)
                .then(async newmsg => {
                    newmsg.createReactionCollector(filter, { time: 120000 })
                        .on('collect', reaction => {
                            switch (reaction.emoji.name) {
                                case "✅":
                                    newmsg.clearReactions();
                                    let slicedCId = channelId.slice(2, -1);
                                    let givEmbed = new Discord.RichEmbed()
                                        .setTitle("Giveaway Started! Click the 🎉 below to enter!")
                                        .addField("Games", count)
                                        .addField("Duration", giveawayTime, true)
                                        .setColor(Math.floor(Math.random() * 16777215))
                                        .setFooter(new Date().toUTCString())
                                        .setAuthor(`${msg.author.tag}`, msg.author.avatarURL);
                                    i = 1;
                                    gameTitles.forEach(element => {
                                        let split = element.replace(/-/gi, " ");
                                        givEmbed.addField(`Game #${i}`, split);
                                        ++i;
                                    });
                                    // Determine the end date
                                    let sepTime = giveawayTime.split(/(\d+)/);
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
                                        console.log(endDate.getTime() - aoNow.getTime());
                                        anNewMsg.createReactionCollector(givFilter, { time: endDate.getTime() - aoNow.getTime() })
                                            .on("end", reaction => {
                                                arrEntries = reaction.get("🎉").users.array();
                                                console.log(arrEntries);
                                            });
                                        let thisInterval = setInterval(() => {
                                            aoNow = new Date();
                                            if (endDate <= aoNow) {
                                                gameKeys.forEach(element => {
                                                    let winner = Math.floor(Math.random() * (arrEntries.length - 1) + 1)
                                                    console.log(`WINNER: ${arrEntries[winner].tag}`)
                                                    client.users.get(arrEntries[winner].id).send(`You won! Here's your key: ${element}`)
                                                })
                                                anNewMsg.edit("THE GIVEAWAY HAS ENDED")
                                                clearInterval(thisInterval);
                                            };
                                        }, endDate.getTime() - aoNow.getTime());
                                        await anNewMsg.react("🎉");
                                    })
                                    break
                                case "🚫":
                                    newmsg.delete()
                                    msg.channel.send("Successfully cancelled.")
                                    break
                            };
                        })
                    await newmsg.react("✅");
                    await newmsg.react("🚫");
                }); // TODO: Add reaction control for finalisation
            break
    }
});

client.login(token_file.discord.bot_token);