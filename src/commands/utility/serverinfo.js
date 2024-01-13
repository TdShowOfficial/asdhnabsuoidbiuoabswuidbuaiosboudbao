const { SlashCommandBuilder, EmbedBuilder, ChannelType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("guild-info")
    .setDescription("Get information about a guild")
    .addStringOption(option => option.setName("guild-id").setDescription("The guild/server id").setRequired(true)),

    async execute (interaction, client) {
        const {options} = interaction;
        const guildID = options.getString("guild-id");
        const guild = await client.guilds.cache.get(guildID)

        if (!guild) {
            await interaction.reply({
                content: `I cannot find a guild with the id ${guildID}!`,
                ephemeral: true
            })
        }

        const startEmbed = new EmbedBuilder()
        .setDescription(`As i can see you want info about \`${guildID}\`, choose a option below!`)
        .setColor("White")

        const name = guild.name;
        const id = guild.id;
        const ownerId = guild.ownerId;
        const textChannelCount = guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildText).size;
        const voiceChannelCount = guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildVoice).size;
        const defaultMessage = guild.defaultMessageNotifications;
        const afkTimeout = guild.afkTimeout;
        const created = guild.createdAt;
        const avatar = guild.iconURL();
        const banner = guild.bannerURL();
        const roleCount = guild.roles.cache.size;
        const channels = guild.channels.cache.size;
        const totalMembers = guild.memberCount;
        const botMembers = guild.members.cache.filter(member => member.user.bot).size;
        const humanMembers = totalMembers - botMembers;
        const memberText = `Bots: ${botMembers} \nHumans: ${humanMembers} \n\n**TOTAL:** ${totalMembers}`

        const text =  `Text: ${textChannelCount}`;
        const voice = `Voice: ${voiceChannelCount}`;

        /*const mods = guild.members.forEach(async member => {
            if (member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                return `\n${member}`
            }
        })

        const admin = guild.members.forEach(async member => {
            if (member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
                return `\n${member}`
            }
        })*/


        const embed = new EmbedBuilder()
        .setTitle(`Guild Information for ${name}`)
        .setThumbnail(`${avatar}`)
        .addFields(
            {name: "Name:", value: `${name}`},
            {name: "ID:", value: `${id}`},
            {name: "Owner ID:", value: `${ownerId}`},
            {name: "Owner Tag:", value: `<@${ownerId}>`},
            {name: "Channel Count:", value: `\n${text} \n${voice} \n\n TOTAL: ${channels}`},
            {name: "Roles:", value: `${roleCount}`},
            {name: "Default Message Perms:", value: `${defaultMessage}`},
            {name: "AFK Timeout:", value: `${afkTimeout}`},
            {name: "Created At:", value: `${created}`},
            {name: "Avatar:", value: `[Link](${avatar})`},
            {name: "Membercount:", value: memberText},
            /*{name: "Staff:", value: `Admins: ${admin} \nModerators: ${mods}`}*/
        )

        if (banner) {
            embed.addFields({
                name: "Banner:",
                value: `[Link](${banner})`
            })

            embed.setImage(`${banner}`)
        }

        const owner = client.users.cache.get(`${guild.ownerId}`);

        function channelsD(type) {
            const channels = guild.channels.cache.filter((x) => x.type === type).map((channel) => `<#${channel.id}>`).join(', ')

            if (!channels) {
                return "No channels"
            } else {
                if (channels.length >= 1024) {
                    return "Too much channels to show!"
                } else {
                    return channels
                }
            }
        }

        function countC(channelType) {
            let count = 0;
            const channels = guild.channels.cache.filter((x) => x.type === channelType).size;

            return channels
        }

        const channelEmbed = new EmbedBuilder()
        .setTitle("Channel Infos")
        .setColor("White")
        .addFields(
            {name: "Channel Count:", value: `TOTAL: ${guild.channels.cache.size}`},
            {name: `${countC(ChannelType.GuildText)} Text Channels:`, value: `${channelsD(ChannelType.GuildText)}`},
            {name: `${countC(ChannelType.GuildVoice)} Voice Channels:`, value: `${channelsD(ChannelType.GuildVoice)}`},
            {name: `${countC(ChannelType.GuildAnnouncement)} Announcement Channels:`, value: `${channelsD(ChannelType.GuildAnnouncement)}`},
            {name: `${countC(ChannelType.GuildDirectory)} Directory Channels:`, value: `${channelsD(ChannelType.GuildDirectory)}`},
            {name: `${countC(ChannelType.GuildStageVoice)} Stage Voice Channels:`, value: `${channelsD(ChannelType.GuildStageVoice)}`},
            {name: `${countC(ChannelType.PublicThread)} Public Threads:`, value: `${channelsD(ChannelType.PublicThread)}`},
            {name: `${countC(ChannelType.PrivateThread)} Private Threads:`, value: `${channelsD(ChannelType.PrivateThread)}`},
            {name: `${countC(ChannelType.GuildForum)} Forum Channels:`, value: `${channelsD(ChannelType.GuildForum)}`},
            {name: `${countC(ChannelType.AnnouncementThread)} Announcement Threads:`, value: `${channelsD(ChannelType.AnnouncementThread)}`}
        )

        const select = new StringSelectMenuBuilder()
        .setCustomId("guild")
        .setPlaceholder("Choose the info you want to get")
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel("Basic Info")
            .setDescription(`Get basic info about the guild ${guild.name}`)
            .setValue("basic-info"),

            new StringSelectMenuOptionBuilder()
            .setLabel("Channel Info")
            .setDescription(`Get all information about the channels of ${guild.name}`)
            .setValue("channel-info"),
        )

        if (owner) {

            const ownerEmbed = new EmbedBuilder()
            .setTitle(`Owner Information of ${guild.name}`)
            .setThumbnail(`${owner.displayAvatarURL()}`)
            .addFields(
                {name: "Name:", value: `${owner.username}`},
                {name: "ID:", value: `${owner.id}`},
                {name: "Tag:", value: `${owner}`},
                {name: "Created Account:", value: `${owner.createdAt}`},
            )

            const row = new ActionRowBuilder()
            .addComponents(select)

            select.addOptions(
                new StringSelectMenuOptionBuilder()
                .setLabel("Owner Info")
                .setDescription(`Get all information about ${owner.username}`)
                .setValue("owner-info")
            )

            const msg = await interaction.reply({
                embeds: [startEmbed],
                components: [row]
            })

            const collector = await msg.createMessageComponentCollector();

            collector.on("collect", async (i) => {
                if (i.user.id !== interaction.user.id) {
                    await interaction.reply({
                        content: "Sorry, you are not allowed to use these buttons!",
                        ephemeral: true
                    }).catch(err => {return;})
                } else {

                    if (i.values[0] === "channel-info") {
                        await i.reply({ embeds: [channelEmbed], ephemeral: true})
                    }

                    if (i.values[0] === "basic-info") {
                        await i.reply({ embeds: [embed], ephemeral: true})
                    }

                    if (i.values[0] === "owner-info") {
                        await i.reply({ embeds: [ownerEmbed], ephemeral: true})
                    }

                }
            })

        } else {
            const row = new ActionRowBuilder().addComponents(select)

            const msg = await interaction.reply({
                embeds: [startEmbed],
                components: [row]
            })

            const collector = await msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect });

            collector.on("collect", async (i) => {
                if (i.user.id !== interaction.user.id) {
                    await i.reply({
                        content: "Sorry, you are not allowed to use these buttons!",
                        ephemeral: true
                    }).catch(err => {return;})
                } else {
                    if (i.values[0] === "channel-info") {
                        await i.reply({ embeds: [channelEmbed], ephemeral: true})
                    }

                    if (i.values[0] === "basic-info") {
                        await i.reply({ embeds: [embed], ephemeral: true})
                    }
                }
            })
        }
    }
}