const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const fetch = require('snekfetch');

const bot = new Discord.Client({disableEveryone: false});

let coins = require("./coins.json");

//** BOAS VINDAS **

bot.on("guildMemberAdd", member => {
  let canal = member.guild.channels.find("name","entrou-saiu");

  let bemembed = new Discord.RichEmbed()
    .setAuthor("Novo membro",`https://cdn.discordapp.com/emojis/450112878108999680.gif?v=1`)
    .setColor("#640de5")
    .setThumbnail(member.user.displayAvatarURL)
    .addField("Nome:","" + member.user + "")
    .addField("Fique atento:",`Leia as regras deste server antes de tudo '3'`)

  if (!!canal) {
      canal.send(bemembed); 
  } else {
      console.log("Nenhum canal foi encontrado!")
  }
});

bot.on('guildMemberRemove', member => {
  let canal = member.guild.channels.find("name","entrou-saiu");
  if (!!canal) {
      canal.send("Vish! " + member.user + " vazou do servidor!"); 
  } else {
      console.log("Nenhum canal foi encontrado!")
  }
});

bot.on("guildMemberAdd", member => {
  let canal = member.guild.channels.find("name","bot-hell");

  let bemembed = new Discord.RichEmbed()
    .setAuthor("Novo membro",`https://cdn.discordapp.com/emojis/450112878108999680.gif?v=1`)
    .setColor("#640de5")
    .setThumbnail(member.user.displayAvatarURL)
    .addField("Nome:","" + member.user + "")
    .addField("Fique atento:",`Leia as regras deste server antes de tudo '3'`)

  if (!!canal) {
      canal.send(bemembed); 
  } else {
      console.log("Nenhum canal foi encontrado!")
  }
});

bot.on("ready",async () => {
  console.log(`Em funcionamento!!!! total de ${bot.channels.size} Canais, em ${bot.guilds.size}servers, um total de ${bot.users.size} usuarios.`);
  bot.user.setActivity(`${bot.users.size} Pessoas!`, {type: "LISTENING"});
});


bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if(!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  }

  if(!coins[message.author.id]){
    coins[message.author.id] = {
      coins: 0
    };
  }

  let coinAmt = Math.floor(Math.random() * 15) + 1;
  let baseAmt = Math.floor(Math.random() * 15) + 1;
  console.log(`${coinAmt} ; ${baseAmt}`);

  if(coinAmt === baseAmt){
    coins[message.author.id] = {
      coins: coins[message.author.id].coins + coinAmt
    };
  fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
    if (err) console.log(err)
  });
  let coinEmbed = new Discord.RichEmbed()
  .setAuthor(message.author.username)
  .setColor("#9442302")
  .addField("💸", `${coinAmt} coins adicionadas!`);

  message.channel.send(coinEmbed);
  }

  let prefix = prefixes[message.guild.id].prefixes;

  //let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);


  if(cmd === `${prefix}kick`){

    //!kick @daeshan askin for it

    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send("Não achei o usuário!");
    let kReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Sem permissão!");
    if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Essa pessoa não pode ser expulsa!");

    let kickEmbed = new Discord.RichEmbed()
    .setDescription("~Kick~")
    .setColor("#640de5")
    .addField("Usuario kickado:", `${kUser} com o ID ${kUser.id}`)
    .addField("Kickado por:", `<@${message.author.id}> com o ID ${message.author.id}`)
    .addField("Kickado em:", message.channel)
    .addField("Tempo", message.createdAt)
    .addField("Motivo", kReason);

    let kickChannel = message.guild.channels.find(`name`, "puniçoes");
    if(!kickChannel) return message.channel.send("Não achei o canal #puniçoes");

    message.guild.member(kUser).kick(kReason);
    kickChannel.send(kickEmbed);

    return;
  }
  
  if(cmd === `${prefix}ban`){

    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send("Não achei o usuário!");
    let bReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Sem permissão!");
    if(bUser.hasPermission("BAN_MEMBERS")) return message.channel.send("Esta pessoa não pode ser kickada!");

    let banEmbed = new Discord.RichEmbed()
    .setDescription("~Ban~")
    .setColor("#640de5")
    .addField("Usuario Banido:", `${bUser} ID: ${bUser.id}`)
    .addField("Banido Por:", `<@${message.author.id}> ID: ${message.author.id}`)
    .addField("Banido em:", message.channel)
    .addField("Quando:", message.createdAt)
    .addField("Motivo:", bReason);

    let incidentchannel = message.guild.channels.find(`name`, "puniçoes");
    if(!incidentchannel) return message.channel.send("Não achei o canal #puniçoes");

    message.guild.member(bUser).ban(bReason);
    incidentchannel.send(banEmbed);


    return;
  }

  if(cmd === `${prefix}report`){

    //!report @ned this is the reason

    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Não achei o usuario!");
    let rreason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("Novo Report")
    .setColor("#640de5")
    .addField("Usuario Reportado:", `${rUser} ID: ${rUser.id}`)
    .addField("Reportado por:", `${message.author} ID: ${message.author.id}`)
    .addField("Canal:", message.channel)
    .addField("Quando:", message.createdAt)
    .addField("Motivo:", rreason);

    let reportschannel = message.guild.channels.find(`name`, "reports");
    if(!reportschannel) return message.channel.send("Não achei o canal #reports");


    message.delete().catch(O_o=>{});
    reportschannel.send(reportEmbed);

    return;
  }
  
  if(cmd === `${prefix}serverinfo`){
    
    let sicon = message.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
    .setDescription("Informação do Server")
    .setColor("#640de5")
    .setThumbnail(sicon)
    .addField(":shield: Nome do Server", message.guild.name)
    .addField(":date: Criado em", message.guild.createdAt)
    .addField(":inbox_tray: Você entrou", message.member.joinedAt)
    .addField(":busts_in_silhouette: Total de membros", message.guild.memberCount)
    .addField(":green_book:Onlines:",message.guild.presences.size)
    .addField(":crown:Criador", message.guild.owner)
    .addField(":computer:ID",message.guild.id)
    .addField(":earth_americas:Região",message.guild.region)
    .addField(":speech_balloon:Canais",message.guild.channels.size)
    .addField(":zzz:Canal de Afk:",message.guild.afkChannel.name)
    .addField(":stuck_out_tongue_winking_eye:Emojis:",message.guild.emojis.size)
    .setTimestamp()
    
    return message.channel.send(serverembed);
    }
  
  
  if(cmd === `${prefix}botinfo`){
    
    let bicon = bot.user.displayAvatarURL;
    let botembed =new Discord.RichEmbed()
    .setDescription("Informações do Bot")
    .setColor("#640de5")
    .setThumbnail(bicon)
    .addField("Nome do Bot:",bot.user.username)
    .addField("Criado em:",bot.user.createdAt)
    .addField("ID:",bot.user.id)
    .addField("Verificado:",bot.user.verified)
    .addField("Ping",bot.ping)
    .addField("Criador Por:",`[XXX]Bruninhuh_sα∂#7937`)
    .addField("Total de Guildas",bot.guilds.size)
    .addField("Meu site:",`http://darkbotsite.glitch.me \nhttp://bit.ly/2yAZsuZ`)
    .setTimestamp()
    
    return message.channel.send(botembed);
  }

  if(cmd === `${prefix}ping`){

  let botembed =new Discord.RichEmbed()
  .setThumbnail(bot.user.displayAvatarURL)
  .setColor("#640de5")
  .setTimestamp()
  .addField('Veja abaixo para saber meu ping.','Antes de se perguntar, porque saber meu ping? Bem, é por causa que alguns comandos meus dão umas travadas, então é bom usar ele antes de executar um comando.')
  .addField('Meu ping é de:',`${bot.ping}`);
  return message.channel.send(botembed);
}


if(cmd === `${prefix}creditos`){
    
  let botembed =new Discord.RichEmbed()
  .setDescription("Créditos do Bot")
  .setColor("#640de5")
  .setThumbnail(message.author.displayAvatarURL)
  .addField("Nome do Bot",bot.user.username)
  .addField("Criado em:",bot.user.createdAt)
  .addField("Criado por:",message.author.username)

  return message.channel.send(botembed);
}

if(cmd === `${prefix}ajuda`){
  let helpembed =new Discord.RichEmbed()
  .setAuthor(bot.user.username)
  .setColor("#8A2BE2")
  .setDescription(`Os Comandos neste server por enquanto são: \n ${prefix}ban(Bane Álguem) \n ${prefix}kick(Expulsa alguem) \n ${prefix}tempmute(Muta alguem) \n ${prefix}serverinfo(Mostra as informações do server) \n ${prefix}botinfo(Mostra minhas informações \n ${prefix}ping(Mostra a minha latencia) \n ${prefix}ajuda(Mostra essa tela) \n ${prefix}limpar(Limpa o chat) \n ${prefix}server(Envio meu server em sua DM)`)
  .setTitle("Comandos")
  .setTimestamp()
  .setFooter("Comandos")
  

  try{
    await message.author.send(helpembed)
  }catch(e){
    console.log(e.stack);
    message.channel.send(helpembed)
  }
  message.channel.send(":eight_pointed_black_star:|<@" + message.author.id + ">,Enviei os comandos no seu privado!")
    
}

if(cmd === `${prefix}limpar`){
  let messagecount = parseInt(args.join(' '));

    if(!message.member.roles.some(r=>["Staff"].includes(r.name)) )
    return message.reply("Você precisa do cargo `Staff` para poder limpar o chat.");
    
    message.channel.fetchMessages({
        limit: messagecount
    }).then(messages => message.channel.bulkDelete(messages));

    let clearembed = new Discord.RichEmbed()
        .setThumbnail(message.author.displayAvatarURL)
        .setColor("#640de5")
        .setTimestamp()
        .addField('**Ação**', `**Limpar** \n`)
        .addField('**Staff:**', `${message.author.username}`)
        .addField('**Quantidade de mensagens deletadas:**', `${messagecount}`);

return message.channel.send(clearembed);
}

if(cmd === `${prefix}tempmute`){
let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!tomute) return message.reply("Não Achei o usuario.");
  if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Não posso mutar esse usuario");
  let muterole = message.guild.roles.find(`name`, "muted");
  //start of create role
  if(!muterole){
    try{
      muterole = await message.guild.createRole({
        name: "muted",
        color: "#1a1aff",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  //end of create role
  let mutetime = args[1];
  if(!mutetime) return message.reply("Especifique o tempo!");

  await(tomute.addRole(muterole.id));
  message.reply(`<@${tomute.id}> Foi mutado por ${ms(ms(mutetime))}`);

  setTimeout(function(){
    tomute.removeRole(muterole.id);
    message.channel.send(`<@${tomute.id}> Foi desmutado!`);
  }, ms(mutetime));


//end of module
}

if(cmd === `${prefix}addcargo`){
//!addrole @andrew Dog Person
if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("Sem premissão.");
let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
if(!rMember) return message.reply("Não encontrei o usuario.");
let role = args.join(" ").slice(22);
if(!role) return message.reply("Coloque o cargo!");
let gRole = message.guild.roles.find(`name`, role);
if(!gRole) return message.reply("Não achei o cargo.");

if(rMember.roles.has(gRole.id)) return message.reply("Ele(a) ja possuí este cargo");
await(rMember.addRole(gRole.id));

try{
  await rMember.send(`Parabéns, você recebeu o cargo: ${gRole.name}`)
}catch(e){
}
  message.channel.send(`Parabéns para o <@${rMember.id}>, por conseguir o cargo: ${gRole.name}.`)
}

if(cmd === `${prefix}say`){
if(!message.member.hasPermission("ADMINISTRATOR")) return;
const sayMessage = args.join(" ");
message.delete().catch();
message.channel.send(sayMessage);

}

if(cmd === `${prefix}setprefixo`){
if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Sem permissão.");
if(!args[0] || args[0 == "help"]) return message.reply("Use: d!setprefixo <Prefixo desejado>");

let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

prefixes[message.guild.id] = {
  prefixes: args[0]
};

fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err) => {
  if (err) console.log(err)
});

let sEmbed = new Discord.RichEmbed()
.setColor("#8A2BE2")
.setTitle("Novo prefixo:")
.setDescription(`Mudou para: ${args[0]}`)
.addField("OBS:",`Aguarde alguns segundos para usar algum comando, pois estou salvando a nova configuração :P`)

message.channel.send(sEmbed);

}

if(cmd === `${prefix}coins`){
//!coins
if(!coins[message.author.id]){
  coins[message.author.id] = {
    coins: 0
  };
}

let uCoins = coins[message.author.id].coins;


let coinEmbed = new Discord.RichEmbed()
.setAuthor(message.author.username)
.setColor("#8A2BE2")
.addField("💸", uCoins);

message.channel.send(coinEmbed);

}

if(cmd === `${prefix}avatar`){
let embed = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
let avatarembed = new Discord.RichEmbed()
      .setTitle("Avatar")
      .setImage(`${embed.user.displayAvatarURL}`)
      .setColor("#640de5")
      .setTimestamp()
      .setDescription("Olha esse Avatar!")
message.channel.send(avatarembed);

}

if(cmd === `${prefix}userinfo`){
  let infoembed = new Discord.RichEmbed()
  .setDescription("Suas informações")
  .setColor("#640de5")
  .addField("Nome:",message.member.user.username)
  .addField("Conta criada:",message.member.user.createdAt)
  .addField("ID:",message.member.id)
  .addField("Entrou aqui em:",message.member.joinedAt)
  .addField("Tag do Discord:",message.member.user.discriminator)
  .addField("Seu maior cargo neste server:",message.member.highestRole)
  .addField("Total de Cargos:",message.member.roles.size)
  .addField("Status:",message.author.presence.status)
  .setTimestamp()
  .setImage(message.author.displayAvatarURL)

message.channel.send(infoembed)

}

if(cmd === `${prefix}anuncio`){
  let aanuncio = args.join(" ").slice(0);

  let novosembed = new Discord.RichEmbed()
  .setAuthor("Novo Anúncio",'https://cdn.discordapp.com/emojis/450112878108999680.gif?v=1')
  .setDescription(`${aanuncio}`)
  .setColor("#640de5")
  .addField("By:",message.author.username)
  .setTimestamp()
  .setFooter("Anúncio",message.author.displayAvatarURL)
  

  let anunciochannel = message.guild.channels.find(`name`, "anuncios");
    if(!anunciochannel) return message.channel.send("Não achei o canal #anuncios");

    message.delete().catch(O_o=>{});
    anunciochannel.send(novosembed);
    anunciochannel.send("@everyone ")
    message.channel.send("Anúncio Feito com sucesso,<@" + message.author.id + "> ")
}

if(cmd === `${prefix}randomgato`){
  /*
      Fetch data from the restful API
    */
   fetch.get('https://aws.random.cat/meow').then(cat => {
     let catembed = new Discord.RichEmbed()
    .addField('Gatinhos!! :cat:','Se dizer que isso não é uma fofura, retire o que disse.')
    .setImage(`${cat.body.file}`)
    .setColor("#640de5");
    message.channel.send(catembed).catch(e => logger.error(e))
}).catch(err => {
    if (err) {
        message.channel.send('Opa! Algo deu errado...');
    }
});
}

if(cmd === `${prefix}random`){
  fetch.get('http://www.splashbase.co/api/v1/images/random').then(photo => {
    let rembed = new Discord.RichEmbed()
    .setDescription("Fotos aleatórias! >->")
    .setImage(`${photo.body.url}`)
    .setColor("#640de5");
    message.channel.send(rembed)
.catch(e => logger.error(e));
}).catch(err => {
    if (err) {
        message.channel.send('Opa! Algo deu errado...');
    }
});
}

if(cmd === `${prefix}kamehameha`){
let user = message.mentions.users.first();
    if(message.mentions.users.size < 1) return message.reply("Você não mencionou ninguém")
        let arquivo = new Discord.Attachment()
       .setAttachment("https://media1.tenor.com/images/5a40d02b078e86cccfb3d0c1b4e84f73/tenor.gif","kamehameha.gif");

 message.channel.send("<@" + message.author.id + "> Usou um kamehameha em <@"+ user.id +">",arquivo)

}

if(cmd === "<@"+bot.user.id+">"){
  let embed = new Discord.RichEmbed()
  .setColor("#640de5")
  .setDescription("Meu prefixo")
  .addField("Olá",":eight_pointed_black_star:| Eae <@" + message.author.id + ">, Quer saber sobre meu prefixo? Então leia a baixo. ")
  .addField("Ajuda:",`Meu prefixo nesta guild é: **${prefix}**, use: **${prefix}ajuda** para saber os comandos.`)
  .setTimestamp();

 message.channel.send(embed);
}

if(cmd === `${prefix}animar`){
    message.delete();
    message.channel.send("<@" + message.author.id + "> **Animou o chat!** \n https://cdn.discordapp.com/attachments/386965973602795523/446431692434046976/Seqci.gif");
  }

  if(cmd === `${prefix}stream`){
  if(message.member.id == "287031710787436556") {
    
    let args = message.content.split(' ').slice(1).join(' ');

    if(!args){
      message.reply("Insira o status de streaming");
    }

    bot.user.setActivity(`${args}`, {
      type: 'STREAMING',
      url: 'https://twitch.tv/sadbruninhuh_',
    });
    message.reply('Alterado.');
  } else {
    message.reply("Apenas o criador do bot, pode utilizar este comando.")
  }

}

if(cmd === `${prefix}server`){
try{
  await message.author.send("https://discord.gg/tsudwea")
}catch(e){
  console.log(e.stack);
  message.channel.send("Parece que não consegui mandar em seu privado :/ Então esta aí: https://discord.gg/tsudwea")
}
message.channel.send(":eight_pointed_black_star:|<@" + message.author.id + ">, Enviei o convite em seu privado")
}

});

bot.login(botconfig.token);
