const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports= {
    data: new SlashCommandBuilder()
    .setName('vouch')
    .setDescription('Ceate a new vouch for this server!')
    .addStringOption(option => option.setName('message').setDescription('Type a vouch for this discord and a service you recieved.').setRequired(true))
    .addStringOption(option => option.setName('stars').setRequired(true).setDescription('Add an amount of starsfor the vouch, from 1-5.')
    .addChoices(
        { name: '⭐️⭐️⭐️⭐️⭐️', value: '⭐️⭐️⭐️⭐️⭐️' },
        { name: '⭐️⭐️⭐️⭐️', value: '⭐️⭐️⭐️⭐️' },
        { name: '⭐️⭐️⭐️', value: '⭐️⭐️⭐️' },
        { name: '⭐️⭐️', value: '⭐️⭐️' },
        { name: '⭐️', value: '⭐️' } )),
        async execute (interaction, member) {
            const msg = interaction.options.getString('message')
            const stars = interaction.options.getString('stars')

            const embed = new EmbedBuilder()
            .setColor('Gold')
            .setTitle(`New vouch created!`)
            .setDescription(`${stars}`)
            .addFields({ name: `Vouch:`, value: `${msg}`, inline: false })
            .addFields({ name: `Created By:`, value: `<@${interaction.user.id}>`, inline: false})
            .setTimestamp()
	    .setFooter({ text: 'Thanks for leaving a vouch on us!', iconURL: 'https://i.imgur.com/sYNRX73.png' });

            await interaction.reply({ embeds: [embed] });
     }  
 }
