const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');

client.on("guildMemberAdd", member => {
  let canal = member.guild.channels.find("name","entrou-saiu");

  if (!!canal) {
      canal.send("Aí, galera! Um tal de " + member.user + " entrou no servidor! http://bit.ly/2GUaRVH"); 
  } else {
      console.log("Nenhum canal foi encontrado!")
  }
});

client.on('guildMemberRemove', member => {
  let canal = member.guild.channels.find("name","entrou-saiu");
  if (!!canal) {
      canal.send("Vish! " + member.user + " vazou do servidor!"); 
  } else {
      console.log("Nenhum canal foi encontrado!")
  }
});
 
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];
client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});
client.on("message", message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;
 
  let command = message.content.split(" ")[0];
  command = command.slice(config.prefix.length);
 
  let args = message.content.split(" ").slice(1);
  // The list of if/else is replaced with those simple 2 lines:
 
  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    console.error(err);
  }
 
});
 
client.login(config.token)