import { RichEmbed, TextChannel } from 'discord.js';

import { Guild } from './../../types/dbase/business/guild.type';
import { ScannedFaction } from './../../types/businesslogic/scanned.faction.type';
import { ScannedRegion } from './../../types/businesslogic/scanned.region.type';

export class EmbedHelper {
    channel: TextChannel;
    guildSettings: Guild;
    authorName: string;
    authorAvatarUrl: string;

    constructor(
        channel: TextChannel,
        guildSettings: Guild,
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
    public generateQuote(
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
    public generateQuoteText(
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
    public generateEmbed(
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
}