import { RichEmbed, TextChannel, Message } from 'discord.js';

import { GuildConfiguration, ActivityCacheItem } from './../../types/dbase/persisted.types';
import { ScannedFaction, ScannedRegion } from './../../types/businesslogic/business.types';

export class EmbedHelper {
    channel: TextChannel;
    guildSettings: GuildConfiguration;
    authorName: string;
    authorAvatarUrl: string;

    constructor(
        channel: TextChannel,
        guildSettings: GuildConfiguration,
        authorName: string = '',
        authorAvatarUrl: string = ''
    ) {
        this.channel = channel;
        this.guildSettings = guildSettings;
        this.authorName = authorName;
        this.authorAvatarUrl = authorAvatarUrl;
    }
    /* ---------------------------------------------------------------------------------------------------------------
       Generic
       ---------------------------------------------------------------------------------------------------------------*/
    private generateGeneric(): RichEmbed {
        let embed = new RichEmbed()
            .setThumbnail(this.guildSettings.messagesImage)
            .setTimestamp(new Date())
            .setFooter(this.guildSettings.messagesFooterName, this.guildSettings.messagesImage);

        return embed;
    }

    public sendValidationError(
        usage: string,
        errors: string
    ) : void  {
        this.channel.send({
                embed: this.generateGeneric()
                    .setColor(10684167)
                    .setAuthor(this.authorName, this.authorAvatarUrl)
                    .setTitle('Invalid request')
                    .setDescription(usage)
                    .addField('Errors', errors)
            });
    }

    public static Error(
        channel: TextChannel
    ) : void  {
        channel.send({
            embed: new RichEmbed()
            .setThumbnail('https://i.imgur.com/5L7T68j.png')
            .setTimestamp(new Date())
            .setFooter('kuBot', 'https://i.imgur.com/5L7T68j.png')
            .setColor(10684167)
            .setTitle('Error')
            .setDescription('An error occurred while processing your request')
        });
    }

    public static CommandsDescription(
        embed: RichEmbed
    ) : RichEmbed {
        embed
            .addField('!help', 'Displays the available commands list.\n')
            .addField('!scan', 'Scans Sirius sector.\n')
            .addField('!watch', 'Adds a player to the watch list.\n')
            .addField('!show', 'Displays a watch list.\n')
            .addField('!quote', 'Quotes one and only one message using its identifier.\n')
            .addField('!quotetext', 'Quotes a text.\n')
            .addField('!embed', 'Creates an embed using a title and a content message.\n');

        return embed;
    }

    public static CommandsDescriptionAdmin(
        embed: RichEmbed
    ): RichEmbed {
        embed.addField('!remove', 'Removes a player or a faction from watch lists\n')

        return embed;
    }
    /* ---------------------------------------------------------------------------------------------------------------
       Scan command
       ---------------------------------------------------------------------------------------------------------------*/
    public sendScanResponse(
        playersCount: number,
        factions: ScannedFaction[],
        regions: ScannedRegion[]
    ) : void {
        let embed = this.generateGeneric()
            .setColor(3447003)
            .setTitle(`**${playersCount} Players online**\n\n`)
            .setDescription(`Scanning ${this.guildSettings.scanMainRegionName}...`);

        let factionsDescription = '';
        factions.forEach(faction => {
            factionsDescription += `**${faction.name}** : ${faction.playersCount}\n`;
        });

        embed.addField('Factions', factionsDescription);

        regions.forEach(region => {
            let watch = '~';
            if (region.watchedPlayers.length > 0) {
                watch = '';
                region.watchedPlayers.forEach(player => {
                    watch += `${player.name}`;

                    if (player.comment)
                        watch += ` - ${player.comment}`;

                    watch += '\n';
                });
            }

            embed.addField(`**${region.name}** : ${region.playersCount} players`, watch);
        });

        this.channel.send({
            embed: embed
        });
    }
    /* ---------------------------------------------------------------------------------------------------------------
       Quote command
       ---------------------------------------------------------------------------------------------------------------*/
    private generateQuote(
        user: string,
        quoteSendDate: Date,
        quoteAuthor: string,
        quoteContent: string
    ) : RichEmbed {
        let embed = new RichEmbed()
            .setTimestamp(quoteSendDate)
            .setFooter(`Quote requested by ${user}`, 'https://i.imgur.com/5L7T68j.png')
            .setColor(0x2e9c3f)
            .addField(`${quoteAuthor} wrote:`, quoteContent);

        return embed;
    }

    public sendQuote(
        user: string,
        quoteSendDate: Date,
        quoteAuthor: string,
        quoteContent: string
    ) : void {
        this.channel.send({
            embed: this.generateQuote(user, quoteSendDate, quoteAuthor, quoteContent)
        });
    }
    /* ---------------------------------------------------------------------------------------------------------------
       QuoteText command
       ---------------------------------------------------------------------------------------------------------------*/
    private generateQuoteText(
        user: string,
        quoteContent: string
    ) : RichEmbed {
        let embed = new RichEmbed()
            .setTimestamp(new Date())
            .setFooter('kuBot', 'https://i.imgur.com/5L7T68j.png')
            .setColor(0x2e9c3f)
            .addField(`${user} is quoting this text:`, quoteContent);

        return embed;
    }

    public sendQuoteText(
        user: string,
        quoteContent: string
    ) : void {
        this.channel.send({
            embed: this.generateQuoteText(user, quoteContent)
        });
    }
    /* ---------------------------------------------------------------------------------------------------------------
       Embed command
       ---------------------------------------------------------------------------------------------------------------*/
    private generateEmbed(
        user: string,
        title: string,
        content: string
    ) : RichEmbed {
        let embed = new RichEmbed()
            .setTimestamp(new Date())
            .setFooter(`${user}`, 'https://i.imgur.com/5L7T68j.png')
            .setColor(0x2e9c3f)
            .addField(title, content);

        return embed;
    }

    public sendEmbed(
        user: string,
        title: string,
        content: string
    ) : void {
        this.channel.send({
            embed: this.generateEmbed(user, title, content)
        });
    }
    /* ---------------------------------------------------------------------------------------------------------------
        Watch command
       ---------------------------------------------------------------------------------------------------------------*/
    public sendFactionPlayerWatchError(
        name: string,
        factions: string
    ) : void {
        this.channel.send({
            embed: this.generateGeneric()
                .setColor(10684167)
                .setAuthor(this.authorName, this.authorAvatarUrl)
                .setTitle('Error')
                .setDescription(`${name} is already under watch for belonging to the following faction(s) :\n\n${factions}`)
        });
    }

    public sendWatchResponse(
        name: string
    ) : void {
        this.channel.send({
            embed: this.generateGeneric()
            .setColor(3447003)
                .setAuthor(this.authorName, this.authorAvatarUrl)
                .setTitle(`${this.guildSettings.acknowledged}`)
                .setDescription(`${name} added to the watch list`)
        });
    }
    /* ---------------------------------------------------------------------------------------------------------------
       Show command
      ---------------------------------------------------------------------------------------------------------------*/
    public sendShowResponse(
        count: number,
        description: string,
        type: string
    ) : void {
        this.channel.send({
            embed: this.generateGeneric()
            .setColor(3447003)
            .setTitle(`**${count} ${type} in watch list**\n\n`)
            .setDescription(description)
        });
    }
    /* ---------------------------------------------------------------------------------------------------------------
      remove admin command
     ---------------------------------------------------------------------------------------------------------------*/
    public sendRemoveResponse(
        term: string,
        type: string
    ) : void {
        this.channel.send({
            embed: this.generateGeneric()
            .setColor(3447003)
                .setAuthor(this.authorName, this.authorAvatarUrl)
                .setTitle(`${this.guildSettings.acknowledged}`)
            .setDescription(`${term} was removed from ${type} watch list`)
        });
    }

    public sendRemovalFailure(
        term: string,
        type: string
    ) : void {
        this.channel.send({
            embed: this.generateGeneric()
                .setColor(10684167)
                .setAuthor(this.authorName, this.authorAvatarUrl)
                .setTitle('Request failure')
                .setDescription(`${term} isn't defined in ${type} watch list`)
        });
    }
    /* ---------------------------------------------------------------------------------------------------------------
      guild config file upload
     ---------------------------------------------------------------------------------------------------------------*/
    public static SendInvalidGuildConfig(
        channel: TextChannel,
        errors: string
    ) : void {
        channel.send({
            embed: new RichEmbed()
                .setThumbnail('https://i.imgur.com/5L7T68j.png')
                .setTimestamp(new Date())
                .setFooter('kuBot', 'https://i.imgur.com/5L7T68j.png')
                .setColor(10684167)
                .setTitle('Invalid configuration file')
                .setDescription(errors)
        });
    }

    public static SendGuildSettingsInitCompleted(
        channel: TextChannel
    ) : void {
        channel.send({
            embed: new RichEmbed()
                .setThumbnail('https://i.imgur.com/5L7T68j.png')
                .setTimestamp(new Date())
                .setFooter('kuBot', 'https://i.imgur.com/5L7T68j.png')
                .setColor(3447003)
                .setTitle('Settings importation completed')
                .setDescription('kuBot settings for your guild have been validated and saved.')
        });
    }
    /* ---------------------------------------------------------------------------------------------------------------
      Factions activity notice
     ---------------------------------------------------------------------------------------------------------------*/
    private static GenerateActivityNotice(
        factions: ActivityCacheItem[]
    ): RichEmbed {
        let embed = new RichEmbed()
            .setThumbnail('https://i.imgur.com/5L7T68j.png')
            .setTimestamp(new Date())
            .setFooter('kuBot', 'https://i.imgur.com/5L7T68j.png')
            .setColor(3447003)
            .setDescription('An unusually high activity has been reported');

        factions.forEach(faction => {
            embed.addField(faction.name, `${faction.playersCount} players`);
        });

        return embed;
    }

    public static async UpdateActivityNotice(
        message: Message,
        factions: ActivityCacheItem[]
    ): Promise<void> {
        await message.edit(this.GenerateActivityNotice(factions));
    }

    public static async SendActivityNotice(
        channel: TextChannel,
        factions: ActivityCacheItem[]
    ): Promise<string> {
        let message = await channel.send({
            embed: this.GenerateActivityNotice(factions)
        });

        return (<Message>message).id;
    }
    /* ---------------------------------------------------------------------------------------------------------------
        Help command
       ---------------------------------------------------------------------------------------------------------------*/
    public sendHelpResponse() {
        this.channel.send({
            embed: EmbedHelper.CommandsDescription(
                this.generateGeneric()
                .setTitle('KuBot is monitoring Sirius Sector for you!')
                .setDescription('I am doing my best to answer your requests. Please take a look at the following commands :')
            )
        });
    }
    public sendHelpAdminResponse() {
        this.channel.send({
            embed: EmbedHelper.CommandsDescriptionAdmin(
                this.generateGeneric()
                    .setTitle('Admin commands')
            )
        });
    }
}