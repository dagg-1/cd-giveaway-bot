const Discord = require('discord.js');
const token_file = require('./tokens.json')

const client = new Discord.Client();
const prefix = "!";

client.on('ready', () => {
    console.log(`Logged in successfully as ${client.user.username}#${client.user.discriminator}`);
});

// !create [name] [time] [channel] [key] 

client.on('message', msg => {
    // const arguments = msg.content.slice(prefix.length).trim().split(/ +/g);
    // const command = arguments.shift().toLowerCase();
    switch (command) {
        case "create":
            
            break
    }
});

client.login(token_file.discord.bot_token);