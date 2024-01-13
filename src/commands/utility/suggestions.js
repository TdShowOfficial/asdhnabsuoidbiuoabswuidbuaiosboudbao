const { SlashCommandBuilder, EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const suggestion = require('../../schemas/suggestionsSchema.js');
const formatResults = require('../../utils/formatResults.js');

module.exports = {
    owner: true,
    data: new SlashCommandBuilder()
    .setName('suggestion')
    .setDescription('Configure the suggestion system.')
    .addSubcommand(command => command.setName('setup').setDescription('Setup a suggestion channel.').addChannelOption(option => option.setName('channel').setDescription('Input a channel.').addChannelTypes(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(command => command.setName('disable').setDescription('Disable an already-existed suggestion channel.'))
    .addSubcommand(command => command.setName('submit').setDescription('Submit a suggestion for Admins and Staffs.').addStringOption(option => option.setName('suggestion').setDescription('Input a suggestion.').setRequired(true))),
    async execute (interaction) {

    const { options } = interaction;
    const sub = options.getSubcommand();
    const Data = await suggestion.findOne({ GuildID: interaction.guild.id });
    const suggestmsg = options.getString('suggestion')

        switch (sub) {
            case 'setup':

            if (Data) {
                return await interaction.reply({ content: `You already have a suggestion channel **setup**!`, ephemeral: true });
            } else {
                const channel = options.getChannel('channel');
                await suggestion.create({
                    GuildID: interaction.guild.id,
                    ChannelID: channel.id
                })

                const embed = new EmbedBuilder()
                .setColor('Green')
                .setAuthor({ name: `${interaction.guild.name}'s Suggestion System`})
                .setTitle('Success!')
                .setDescription(`:white_check_mark:・The suggestion system has been successfully **setup** in ${channel}!`)

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            break;
            case 'disable':

            const channel = options.getChannel('channel') || interaction.channel;

            if (!Data) {
                return await interaction.reply({ content: `You don't a suggestion channel **setup**!`, ephemeral: true });
            } else {
                await suggestion.deleteMany({
                    GuildID: interaction.guild.id,
                    ChannelID: channel.id
                });

                const embed = new EmbedBuilder()
                .setColor('Green')
                .setAuthor({ name: `${interaction.guild.name}'s Suggestion System`})
                .setTitle('Success!')
                .setDescription(`:white_check_mark:・The suggestion system has been successfully **disable**!`)

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            break;
            case 'submit':

            if (!Data) {
                return await interaction.reply({ content: `You don't a suggestion channel **setup**!`, ephemeral: true });
            } else {

                const channel = options.getChannel('channel') || interaction.channel;
                await interaction.reply({ content: `Your suggestion has been submitted!`, ephemeral: true });

                const num1 = Math.floor(Math.random() * 256);
                const num2 = Math.floor(Math.random() * 256);
                const num3 = Math.floor(Math.random() * 256);
                const num4 = Math.floor(Math.random() * 256);
                const num5 = Math.floor(Math.random() * 256);
                const num6 = Math.floor(Math.random() * 256);
                const SuggestionID = `${num1}${num2}${num3}${num4}${num5}${num6}`;

                const suggestionembed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.guild.name}'s Suggestion System`, iconURL: interaction.guild.iconURL({ size: 256 })})
                .setColor('Blurple')
                .setThumbnail(interaction.user.displayAvatarURL({ size: 512 }))
                .setTitle(`Suggestion from **${interaction.user.username}**`)
                .setDescription(`> ${suggestmsg}`)
                .setTimestamp()
                .setFooter({ text: `Suggestion ID: ${SuggestionID}`})
                .addFields({ name: 'Upvotes', value: '**No votes**', inline: true})
                .addFields({ name: 'Downvotes', value: '**No votes**', inline: true})
                .addFields({ name: `Votes`, value: formatResults() })
                .addFields({ name: 'Author', value: `> ${interaction.user}`, inline: false})

                const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('upv')
                    .setEmoji('<:tup:1162598259626352652>')
                    .setLabel('Upvote')
                    .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                    .setCustomId('downv')
                    .setEmoji('<:tdown:1162598331390889994>')
                    .setLabel('Downvote')
                    .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                    .setCustomId('totalvotes')
                    .setEmoji('💭')
                    .setLabel('Votes')
                    .setStyle(ButtonStyle.Secondary)
                )

                const button2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('appr')
                    .setEmoji('<a:AUSC_checked:1011088709266985110>')
                    .setLabel('Approve')
                    .setStyle(ButtonStyle.Success),

                    new ButtonBuilder()
                    .setCustomId('rej')
                    .setEmoji('<a:rejected:1162622460835922043>')
                    .setLabel('Reject')
                    .setStyle(ButtonStyle.Danger)
                )

                const msg = await channel.send({ content: `${interaction.user}'s Suggestion`, embeds: [suggestionembed], components: [button, button2] });
                msg.createMessageComponentCollector();

                await suggestion.create({
                    Msg: msg.id,
                    GuildID: interaction.guild.id,
                    AuthorID: interaction.user.id,
                    ChannelID: channel.id,
                    upvotes: 0,
                    downvotes: 0,
                    Upmembers: [],
                    Downmembers: []
                });
            }
        }
    }
}