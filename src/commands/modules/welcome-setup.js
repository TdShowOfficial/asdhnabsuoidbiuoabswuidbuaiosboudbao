const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')
const welcomesetup = require('../../schemas/welcomeScema')


module.exports = {
    data: new SlashCommandBuilder()
    .setName('enable-welcome')
    .setDescription('Enable the welcoming system')
    .addChannelOption(options => options.setName('channel').setDescription('The channel for the welcome message to be sent').setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel')
        const data = await welcomesetup.findOne({ guild: interaction.guild.id });
        if (data) {
            const embed = new EmbedBuilder()
            .setTitle('Welcome System Error')
            .setDescription('Welcome system has been already set up')
            .setTimestamp()
            .setColor('DarkRed')
            await interaction.reply({ embeds: [embed] })
        } else {
            await welcomesetup.create({
                channel: `${channel.id}`,
                guild: `${interaction.guild.id}`
              })

        const embed = new EmbedBuilder()
        .setTitle('Welcome Message has been setup')
        .setDescription(`The welcome message will now be sent in: ${channel}.`)
        .setTimestamp()
        .setColor('Green')
        await interaction.reply({ embeds: [embed] })
        }
        
    }
}