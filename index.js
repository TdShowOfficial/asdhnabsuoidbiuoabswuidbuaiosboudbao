require("dotenv/config");
require("colors");
const keepAlive = require("./keep_alive.js")

const {  Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, AuditLogEvent, Events, Partials, ActivityType, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const { readdirSync } = require("fs");
const mongoose = require('mongoose')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel, Partials.GuildMember],
});
client.commands = new Map();
client.buttons = new Map();
client.config = require("./src/config.js");

const handlerFolder = readdirSync("./src/handlers").filter((f) =>
  f.endsWith(".js")
);
for (const handler of handlerFolder) {
  const handlerFile = require(`./src/handlers/${handler}`);
  handlerFile(client);
}

client.on('guildMemberAdd', member => { //User join into the server
  if(client.guilds.cache.get('1160468000252645406')) { //Checking for the correct server
      return member.roles.add(member.guild.roles.cache.get('1160489181127127071')); 
  }
});

client.login(process.env['Token']);

client.on(Events.GuildMemberAdd, async member => {
  const welcomesetup = require('./src/schemas/welcomeScema.js')
	const data = await welcomesetup.findOne({ guild: member.guild.id })
	const channel = data.channel;
	const channel2 = member.guild.channels.cache.get(channel);
	const guild = data.guild;
	const embed = new EmbedBuilder()
	.setTitle(`Welcome`)
	.setDescription(`Hey ${member}, Welcome To Tdg Development Make Sure To React at <#${'1189964110977319064'}>`)
	.setTimestamp()
	.setColor('Gold')
	channel2.send({ embeds: [embed], content: `${member}` })
})

client.on(Events.ChannelCreate, async channel => {

  channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelCreate,
  })
  .then(async audit => {
      const { executor } = audit.entries.first()

      const name = channel.name;
      const id = channel.id;
      let type = channel.type;

      if (type == 0) type = 'Text'
      if (type == 2) type = 'Voice'
      if (type == 13) type = 'Stage'
      if (type == 15) type = 'Form'
      if (type == 5) type = 'Announcement'
      if (type == 5) type = 'Category'

      const channelID = '1189966181168320574'
      const mChannel = await channel.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('Channel Created')
      .addFields({ name: 'Channel Name', value: `${name} (<#${id}>)`, inline: false })
      .addFields({ name: 'Channel Type', value: `${type}`, inline: false })
      .addFields({ name: 'Channel ID', value: `${id}`, inline: false })
      .addFields({ name: 'Created By', value: `${executor.tag}`, inline: false})
      .setTimestamp()
      .setFooter({ text: 'Mod Logging System' })

      mChannel.send({ embeds: [embed] })
  })
})

client.on(Events.ChannelDelete, async channel => {

  channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelDelete,
  })
  .then(async audit => {
      const { executor } = audit.entries.first()

      const name = channel.name;
      const id = channel.id;
      let type = channel.type;

      if (type == 0) type = 'Text'
      if (type == 2) type = 'Voice'
      if (type == 13) type = 'Stage'
      if (type == 15) type = 'Form'
      if (type == 5) type = 'Announcement'
      if (type == 5) type = 'Category'

      const channelID = '1189966181168320574'
      const mChannel = await channel.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Channel Created')
      .addFields({ name: 'Channel Name', value: `${name}`, inline: false })
      .addFields({ name: 'Channel Type', value: `${type}`, inline: false })
      .addFields({ name: 'Channel ID', value: `${id}`, inline: false })
      .addFields({ name: 'Deleted By', value: `${executor.tag}`, inline: false})
      .setTimestamp()
      .setFooter({ text: 'Mod Logging System' })

      mChannel.send({ embeds: [embed] })
  })
})

client.on(Events.ChannelUpdate, async channel => {

  channel.guild.fetchAuditLogs({
      type: AuditLogEvent.ChannelUpdate,
  })
  .then(async audit => {
      const { executor } = audit.entries.first()

      const name = channel.name;
      const id = channel.id;
      let type = channel.type;

      if (type == 0) type = 'Text'
      if (type == 2) type = 'Voice'
      if (type == 13) type = 'Stage'
      if (type == 15) type = 'Form'
      if (type == 5) type = 'Announcement'
      if (type == 5) type = 'Category'

      const channelID = '1189966181168320574'
      const mChannel = await channel.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
      .setColor('Yellow')
      .setTitle('Channel Updated')
      .addFields({ name: 'Channel Name', value: `${name}`, inline: false })
      .addFields({ name: 'Channel Type', value: `${type}`, inline: false })
      .addFields({ name: 'Channel ID', value: `${id}`, inline: false })
      .addFields({ name: 'Updated By', value: `${executor.tag}`, inline: false})
      .setTimestamp()
      .setFooter({ text: 'Mod Logging System' })

      mChannel.send({ embeds: [embed] })
  })
})

client.on(Events.GuildBanAdd, async member => {

  member.guild.fetchAuditLogs({
      type: AuditLogEvent.GuildBanAdd,
  })
  .then(async audit => {
      const { executor } = audit.entries.first()

      const name = member.user.username;
      const id = member.user.id;

      const channelID = '1189966181168320574'
      const mChannel = await member.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Member Banned')
      .addFields({ name: 'Member Name', value: `${name} (<@${id}>)`, inline: false })
      .addFields({ name: 'Channel Id', value: `${id}`, inline: false })
      .addFields({ name: 'Banned By', value: `${executor.tag}`, inline: false})
      .setTimestamp()
      .setFooter({ text: 'Mod Logging System' })

      mChannel.send({ embeds: [embed] })
  })
})

client.on(Events.GuildBanRemove, async member => {

  member.guild.fetchAuditLogs({
      type: AuditLogEvent.GuildBanRemove,
  })
  .then(async audit => {
      const { executor } = audit.entries.first()

      const name = member.user.username;
      const id = member.user.id;

      const channelID = '1189966181168320574'
      const mChannel = await member.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Member Unbanned')
      .addFields({ name: 'Member Name', value: `${name} (<@${id}>)`, inline: false })
      .addFields({ name: 'Member Id', value: `${id}`, inline: false })
      .addFields({ name: 'Unbanner By', value: `${executor.tag}`, inline: false})
      .setTimestamp()
      .setFooter({ text: 'Mod Logging System' })

      mChannel.send({ embeds: [embed] })
  })
})

client.on(Events.MessageDelete, async message => {

  message.guild.fetchAuditLogs({
      type: AuditLogEvent.MessageDelete,
  })
  .then(async audit => {
      const { executor } = audit.entries.first()

      const mes = message.content;

      if (!mes) return;

      const channelID = '1189966181168320574'
      const mChannel = await message.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Message Deleted')
      .addFields({ name: 'Message Content', value: `${mes}`, inline: false })
      .addFields({ name: 'Message Channel', value: `${message.channel}`, inline: false })
      .addFields({ name: 'Deleted By', value: `${executor.tag}`, inline: false})
      .setTimestamp()
      .setFooter({ text: 'Mod Logging System' })

      mChannel.send({ embeds: [embed] })
  })
})

client.on(Events.MessageUpdate, async (message, newMessage) => {

  message.guild.fetchAuditLogs({
      type: AuditLogEvent.MessageUpdate,
  })
  .then(async audit => {
      const { executor } = audit.entries.first()

      const mes = message.content;

      if (!mes) return;

      const channelID = '1189966181168320574'
      const mChannel = await message.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
      .setColor('Yellow')
      .setTitle('Message Updated')
      .addFields({ name: 'Old Message', value: `${mes}`, inline: false })
      .addFields({ name: 'New Message', value: `${newMessage}`, inline: false })
      .addFields({ name: 'Edited By', value: `${executor.tag}`, inline: false})
      .setTimestamp()
      .setFooter({ text: 'Mod Logging System' })

      mChannel.send({ embeds: [embed] })
  })
})

//Role Create (working)
client.on(Events.GuildRoleCreate, async (interaction) => {

    const createdTime = parseInt(interaction.createdTimestamp / 1000);
    const mentionable = interaction.mentionable ? "true" : "false";
    const managed = interaction.managed ? "true" : "false";
    const hoisted = interaction.hoisted ? "true" : "false";
    const botrole = interaction.botrole ? "true" : "false";
    const permissions = interaction.permissions



    setTimeout(async () => {
        const auditEmbed = new EmbedBuilder().setColor("Yellow").setTimestamp().setFooter({ text: "Mod Logging System"})
        const auditChannel = client.channels.cache.get('1189966181168320574');
        auditEmbed.setTitle("Role Created").addFields(
            {name: "Role Name:", value: interaction.name, inline: false},
            {name: "Role ID:", value: interaction.id, inline: false},
            { name: "Mention", value: `\`<@&${interaction.id}>\``, inline: true },
            { name: "Hoisted", value: `${hoisted}`, inline: true },
            { name: "Mentionable", value: `${mentionable}`, inline: true },
            { name: "Managed", value: `${managed}`, inline: true },
            { name: "Bot Role", value: `${botrole}`, inline: true },
            { name: "Created", value: `<t:${createdTime}:R>`, inline: true },
            { name: "Key Permissions", value: `${JSON.stringify(permissions)}`, inline: false },
        )

    await auditChannel.send({ embeds: [auditEmbed]}).catch(() => null);
    }, 15000)

})
//Role Delete (working)
client.on(Events.GuildRoleDelete, async (interaction) => {
    const auditEmbed = new EmbedBuilder().setColor("Yellow").setTimestamp().setFooter({ text: "Mod Logging System"})

    const auditChannel = client.channels.cache.get('1189966181168320574');
    auditEmbed.setTitle("Role Removed").addFields(
        {name: "Role Name:", value: interaction.name, inline: false},
        {name: "Role ID:", value: interaction.id, inline: false}
    )
    await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
})

client.on(Events.GuildMemberAdd, async member => {

  member.guild.fetchAuditLogs({
      type: AuditLogEvent.GuildMemberAdd,
  })
  .then(async audit => {
      const { executor } = audit.entries.first()

      const name = member.user.username;
      const id = member.user.id;

      const channelID = '1189966181168320574'
      const mChannel = await member.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Member Joined')
      .addFields({ name: 'Member Name', value: `${name} (<@${id}>)`, inline: false })
      .addFields({ name: 'Member Id', value: `${id}`, inline: false })
      .addFields({ name: 'Unbanner By', value: `${executor.tag}`, inline: false})
      .setTimestamp()
      .setFooter({ text: 'Mod Logging System' })

      mChannel.send({ embeds: [embed] })
  })
})

client.on(Events.GuildMemberRemove, async member => {

  member.guild.fetchAuditLogs({
      type: AuditLogEvent.GuildMemberRemove,
  })
  .then(async audit => {
      const { executor } = audit.entries.first()

      const name = member.user.username;
      const id = member.user.id;

      const channelID = '1189966181168320574'
      const mChannel = await member.guild.channels.cache.get(channelID);

      const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Member Left')
      .addFields({ name: 'Member Name', value: `${name} (<@${id}>)`, inline: false })
      .addFields({ name: 'Member Id', value: `${id}`, inline: false })
      .addFields({ name: 'Unbanner By', value: `${executor.tag}`, inline: false})
      .setTimestamp()
      .setFooter({ text: 'Mod Logging System' })

      mChannel.send({ embeds: [embed] })
  })
})



//anti-link

const {PermissionFlagsBits} = require('discord.js'); 
const linkSchema = require('./src/schemas/link.js');
client.on(Events.MessageCreate, async message => {
if (message.author.bot || !message.guild) {
  return;
}
const linkRegex = /(https?:\/\/)?([^\s]+)\.(?=[^\s]+)\S+/gi;
const userPerm = message.member
if (linkRegex.test(message.content)) {
  const Data = await linkSchema.findOne({ Guild: message.guild.id});

  if (!Data) return;

  const memberPerms = Data.Perms;

  const user = message.author;
  const member = message.guild.members.cache.get(user.id);

  if (userPerm.permissions.has(PermissionFlagsBits.ManageGuild)) return;
  else {
    await message.author.send({ content: `${message.author}, You are not allowed to post links in this server!`}).then(msg => {
      setTimeout(() => msg.delete(), 8000)
    })

    ;(await message).delete();
  }
}
})

client.on('messageCreate', (message) => {
  const prefix = '?';
  if (!message.content.startsWith(prefix) || message.author.bot) return
 
 const args = message.content.split(/\s+/)
 
 const command = args.shift().substring(prefix.length)
 

  //the custom embed

  if (command === 'say') {
      const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Some title')
      .setURL('https://discord.js.org/')
      .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/sYNRX73.png', url: 'https://discord.js.org' })
      .setDescription('Some description here')
      .setThumbnail('https://i.imgur.com/sYNRX73.png')
      .addFields(
          { name: 'Regular field title', value: 'Some value here' },
          { name: '\u200B', value: '\u200B' },
          { name: 'Inline field title', value: 'Some value here', inline: true },
          { name: 'Inline field title', value: 'Some value here', inline: true },
      )
      .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
      .setImage('https://i.imgur.com/sYNRX73.png')
      .setTimestamp()
      .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/sYNRX73.png' });

      message.channel.send({ embeds: [embed] });
  }

  if (command === 'custombot') {
    const embed = new EmbedBuilder()
    .setColor('Gold')
    .setTitle(`<:bot23:> Custom Bot`)
    .setDescription('**Discord Logs**')
      .addFields(
        { name: '\<:pP:1190041283658522684>', value: 'Leave Logs' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Role Logs', value: 'Channel Logs', inline: true },
        { name: 'Ban Logs', value: 'Kick Logs', inline: true },
      )


     message.channel.send({ embeds: [embed] });
  }
})

client.on('ready', (c) => {

  client.user.setActivity({
    name: 'Tdg Development',
    type: ActivityType.Dnd,
    url: 'https://www.google.gr/?hl=en'
  })
});



//suggestion

const suggestion = require('./src/schemas/suggestionsSchema.js'); 
const formatResults = require('./src/utils/formatResults.js'); 

client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.guild) return;
    if (!interaction.message) return;
    if (!interaction.isButton) return;

    const data = await suggestion.findOne({ GuildID: interaction.guild.id, Msg: interaction.message.id });
    if (!data) return;
    const message = await interaction.channel.messages.fetch(data.Msg);

    if (interaction.customId == 'upv') {

        if (data.Upmembers.includes(interaction.user.id)) return await interaction.reply({content: `You cannot vote again! You have already sent an upvote on this suggestion.`, ephemeral: true});

        let Downvotes = data.downvotes;
        if (data.Downmembers.includes(interaction.user.id)) {
            Downvotes = Downvotes - 1;
        }

        if (data.Downmembers.includes(interaction.user.id)) {

            data.downvotes = data.downvotes - 1;
        }

        data.Upmembers.push(interaction.user.id);
        data.Downmembers.pull(interaction.user.id);

        const newEmbed = EmbedBuilder.from(message.embeds[0]).setFields({name: `Upvotes`, value: `> **${data.upvotes + 1}** Votes`, inline: true}, { name: `Downvotes`, value: `> **${Downvotes}** Votes`, inline: true}, {name: `Author`, value: `> <@${data.AuthorID}>`}, { name: `Votes`, value: formatResults(data.Upmembers, data.Downmembers)});

                const upvotebutton = new ButtonBuilder()
                .setCustomId('upv')
                .setEmoji('<:tup:1162598259626352652>')
                .setLabel('Upvote')
                .setStyle(ButtonStyle.Primary)

                const downvotebutton = new ButtonBuilder()
                .setCustomId('downv')
                .setEmoji('<:tdown:1162598331390889994>')
                .setLabel('Downvote')
                .setStyle(ButtonStyle.Primary)

                const totalvotesbutton = new ButtonBuilder()
                .setCustomId('totalvotes')
                .setEmoji('💭')
                .setLabel('Votes')
                .setStyle(ButtonStyle.Secondary)

                const btnrow = new ActionRowBuilder().addComponents(upvotebutton, downvotebutton, totalvotesbutton);

                const button2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('appr')
                    .setLabel('Approve')
                    .setEmoji('<a:AUSC_checked:1011088709266985110>')
                    .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                    .setCustomId('rej')
                    .setEmoji('<a:rejected:1162622460835922043>')
                    .setLabel('Reject')
                    .setStyle(ButtonStyle.Danger)
                )

                await interaction.update({ embeds: [newEmbed], components: [btnrow, button2] });

                data.upvotes++;
                data.save();
    }

    if (interaction.customId == 'downv') {

        if (data.Downmembers.includes(interaction.user.id)) return await interaction.reply({ content: `You cannot vote again! You have already sent an downvote on this suggestion.`, ephemeral: true});

        let Upvotes = data.upvotes;
        if (data.Upmembers.includes(interaction.user.id)) {
            Upvotes = Upvotes - 1;
        }

        if (data.Upmembers.includes(interaction.user.id)) {

            data.upvotes = data.upvotes - 1;
        }

        data.Downmembers.push(interaction.user.id);
        data.Upmembers.pull(interaction.user.id);

        const newEmbed = EmbedBuilder.from(message.embeds[0]).setFields({name: `Upvotes`, value: `> **${Upvotes}** Votes`, inline: true}, { name: `Downvotes`, value: `> **${data.downvotes + 1}** Votes`, inline: true}, {name: `Author`, value: `> <@${data.AuthorID}>`}, { name: `Votes`, value: formatResults(data.Upmembers, data.Downmembers)});

                const upvotebutton = new ButtonBuilder()
                .setCustomId('upv')
                .setEmoji('<:tup:1162598259626352652>')
                .setLabel('Upvote')
                .setStyle(ButtonStyle.Primary)

                const downvotebutton = new ButtonBuilder()
                .setCustomId('downv')
                .setEmoji('<:tdown:1162598331390889994>')
                .setLabel('Downvote')
                .setStyle(ButtonStyle.Primary)

                const totalvotesbutton = new ButtonBuilder()
                .setCustomId('totalvotes')
                .setEmoji('💭')
                .setLabel('Votes')
                .setStyle(ButtonStyle.Secondary)

                const btnrow = new ActionRowBuilder().addComponents(upvotebutton, downvotebutton, totalvotesbutton);

                const button2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('appr')
                    .setLabel('Approve')
                    .setEmoji('<a:AUSC_checked:1011088709266985110>')
                    .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                    .setCustomId('rej')
                    .setEmoji('<a:rejected:1162622460835922043>')
                    .setLabel('Reject')
                    .setStyle(ButtonStyle.Danger)
                )

                await interaction.update({ embeds: [newEmbed], components: [btnrow, button2] });

                data.downvotes++;
                data.save();
    }

    if (interaction.customId == 'totalvotes') {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: `Only Admins & Staffs can use this button.`, ephemeral: true });

        let upvoters = [];
        await data.Upmembers.forEach(async member => {
            upvoters.push(`<@${member}>`)
        });

        let downvoters = [];
        await data.Downmembers.forEach(async member => {
            downvoters.push(`<@${member}>`)
        });

        const embed = new EmbedBuilder()
        .addFields({ name: `Upvoters (${upvoters.length})`, value: `> ${upvoters.join(', ').slice(0, 1020) || `No upvoters!`}`, inline: true})
        .addFields({ name: `Downvoters (${downvoters.length})`, value: `> ${downvoters.join(', ').slice(0, 1020) || `No downvoters!`}`, inline: true})
        .setColor('Random')
        .setTimestamp()
        .setFooter({ text: `💭 Vote Data`})
        .setAuthor({ name: `${interaction.guild.name}'s Suggestion System`})

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.customId == 'appr') {

        const upvotebutton = new ButtonBuilder()
        .setCustomId('upv')
        .setEmoji('<:tup:1162598259626352652>')
        .setLabel('Upvote')
        .setStyle(ButtonStyle.Primary)

        const downvotebutton = new ButtonBuilder()
        .setCustomId('downv')
        .setEmoji('<:tdown:1162598331390889994>')
        .setLabel('Downvote')
        .setStyle(ButtonStyle.Primary)

        const totalvotesbutton = new ButtonBuilder()
        .setCustomId('totalvotes')
        .setEmoji('💭')
        .setLabel('Votes')
        .setStyle(ButtonStyle.Secondary)

        upvotebutton.setDisabled(true);
        downvotebutton.setDisabled(true);

        const btnrow = new ActionRowBuilder().addComponents(upvotebutton, downvotebutton, totalvotesbutton);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: `Only Admins & Staffs can use this button.`, ephemeral: true });

        const newEmbed = EmbedBuilder.from(message.embeds[0]).setColor('Green').addFields({ name: '\u200B', value: '<a:AUSC_checked:1011088709266985110> Your suggestion has been approved!'})

        await interaction.update({ embeds: [newEmbed], components: [btnrow] });
    }

    if (interaction.customId == 'rej') {

        const upvotebutton = new ButtonBuilder()
        .setCustomId('upv')
        .setEmoji('<:tup:1162598259626352652>')
        .setLabel('Upvote')
        .setStyle(ButtonStyle.Primary)

        const downvotebutton = new ButtonBuilder()
        .setCustomId('downv')
        .setEmoji('<:tdown:1162598331390889994>')
        .setLabel('Downvote')
        .setStyle(ButtonStyle.Primary)

        const totalvotesbutton = new ButtonBuilder()
        .setCustomId('totalvotes')
        .setEmoji('💭')
        .setLabel('Votes')
        .setStyle(ButtonStyle.Secondary)

        upvotebutton.setDisabled(true);
        downvotebutton.setDisabled(true);

        const btnrow = new ActionRowBuilder().addComponents(upvotebutton, downvotebutton, totalvotesbutton);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: `Only Admins & Staffs can use this button.`, ephemeral: true });

        const newEmbed = EmbedBuilder.from(message.embeds[0]).setColor('Red').addFields({ name: '\u200B', value: '<a:rejected:1162622460835922043> Your suggestion has been rejected!'})

        await interaction.update({ embeds: [newEmbed], components: [btnrow] });
    }       
})





const joinSchema = require('./src/schemas/join2createSchema.js');
const joinchannelschema = require('./src/schemas/jointocreatechannelsSchema.js');

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {

    try {
        if (newState.member.guild === null) return;
    } catch (err) {
        return;
    }

    const joindata = await joinSchema.findOne({ Guild: newState.guild.id});
    const joinchanneldata = await joinchannelschema.findOne({ Guild: newState.member.guild.id, User: newState.member.id});

    const voicechannel = newState.channel;

    if (!joindata) return;

    if (!voicechannel) return;
    else {

        if (voicechannel.id === joindata.Channel) {
            if (joinchanneldata) {
                try {
                    return await newState.member.send({ content: `You already have a voice channel open right now!`, ephemeral: true});
                } catch (err) {
                    return;
                }
            } else {
                try {
                    const channel = await newState.member.guild.channels.create({
                        type: ChannelType.GuildVoice,
                        name: `📞〢Support-${newState.member.user.username}`,
                        userLimit: joindata.VoiceLimit,
                        parent: joindata.Category
                    })

                    try {
                        await newState.member.voice.setChannel(channel.id);
                    } catch (err) {
                        return;
                    }

                    setTimeout(() => {
                        joinchannelschema.create({
                            Guild: newState.member.guild.id,
                            Channel: channel.id,
                            User: newState.member.id
                        }, 500)
                    })

                } catch (err) {
                    try {
                        await newState.member.send({ content: `I could not create your channel. I may be missing permissions. Please contact the Server Owner.`});
                    } catch (err) {
                        return;
                    }

                    return;
                }

                try {

                    const embed = new EmbedBuilder()
                    .setColor('DarkVividPink')
                    .setTimestamp()
                    .setAuthor({ name: `🔊 Join to Create system`})
                    .setFooter({ text: `🔊 Channel Created`})
                    .setTitle('> Channel Created')
                    .addFields({ name: 'Channel Created', value: `> Your voice channel has been \n> created in **${newState.member.guild.name}**`})

                    await newState.member.send({ embeds: [embed] });
                } catch (err) {
                    return;
                }
            }
        }
    }
})

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {

    try {
        if (oldState.member.guild === null) return;
    } catch (err) {
        return;
    }

    const leavechanneldata = await joinchannelschema.findOne({ Guild: oldState.member.guild.id, User: oldState.member.id});
    if (!leavechanneldata) return;
    else {
         const voicechannel = await oldState.member.guild.channels.cache.get(leavechanneldata.Channel);

         try {
            await voicechannel.delete();
         } catch (err) {
            return;
         }

         await joinchannelschema.deleteMany({ Guild: oldState.guild.id, User: oldState.member.id});
         try {

            const embed = new EmbedBuilder()
            .setColor('DarkVividPink')
            .setTimestamp()
            .setAuthor({ name: `🔊 Join to Create system`})
            .setFooter({ text: `🔊 Channel Deleted`})
            .setTitle('> Channel Deleted')
            .addFields({ name: 'Channel Deleted', value: `> Your voice channel has been \n> deleted in **${newState.member.guild.name}**`})

            await newState.member.send({ embeds: [embed] });

        } catch (err) {
            return;
        }
    }
})

keepAlive();
