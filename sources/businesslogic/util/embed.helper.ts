import { RichEmbed, TextChannel, Message } from 'discord.js';
import * as Dal from 'kubot-dal';

import { ScannedFaction, ScannedRegion } from './../../types/business.types';

export class EmbedHelper {
    private static channel: TextChannel;
    private static guildSettings: Dal.Types.GuildConfiguration;
    private static authorName: string;
    private static authorAvatarUrl: string;

    public static Setup(
        channel: TextChannel,
        guildSettings: Dal.Types.GuildConfiguration,
        authorName: string,
        authorAvatarUrl: string
    ): void {
        this.channel = channel;
        this.guildSettings = guildSettings;
        this.authorName = authorName;
        this.authorAvatarUrl = authorAvatarUrl;
    }
    /* ---------------------------------------------------------------------------------------------------------------
       Generic
       ---------------------------------------------------------------------------------------------------------------*/
    private static GenerateGeneric(): RichEmbed {
        let embed = new RichEmbed()
            .setThumbnail(this.guildSettings.messagesImage)
            .setTimestamp(new Date())
            .setFooter(this.guildSettings.messagesFooterName, this.guildSettings.messagesImage);

        return embed;
    }

    public static SendValidationError(
        usage: string,
        errors: string
    ): void {
        this.channel.send({
            embed: this.GenerateGeneric()
                .setColor(10684167)
                .setAuthor(this.authorName, this.authorAvatarUrl)
                .setTitle('Invalid request')
                .setDescription(usage)
                .addField('Errors', errors)
        });
    }

    public static Error(): void {
        this.channel.send({
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
        embed: RichEmbed,
        commandsPrefix: string
    ): RichEmbed {
        embed
            .addField(commandsPrefix+'help', 'Displays the available commands list.\n')
            .addField(commandsPrefix+'scan', 'Scans Sirius sector.\n')
            .addField(commandsPrefix+'watch', 'Adds a player to the watch list.\n')
            .addField(commandsPrefix+'show', 'Displays a watch list.\n')
            .addField(commandsPrefix+'quote', 'Quotes one and only one message using its identifier.\n')
            .addField(commandsPrefix+'quotetext', 'Quotes a text.\n')
            .addField(commandsPrefix+'embed', 'Creates an embed using a title and a content message.\n');

        return embed;
    }

    public static CommandsDescriptionAdmin(
        embed: RichEmbed,
        commandsPrefix: string
    ): RichEmbed {
        embed.addField(commandsPrefix+'remove', 'Removes a player or a faction from watch lists\n')

        return embed;
    }
    /* ---------------------------------------------------------------------------------------------------------------
       Guild config file upload
       ---------------------------------------------------------------------------------------------------------------*/
    public static SendInvalidGuildConfig(
        errors: string
    ): void {
        this.channel.send({
            embed: new RichEmbed()
                .setThumbnail('https://i.imgur.com/5L7T68j.png')
                .setTimestamp(new Date())
                .setFooter('kuBot', 'https://i.imgur.com/5L7T68j.png')
                .setColor(10684167)
                .setTitle('Invalid configuration file')
                .setDescription(errors)
        });
    }

    public static SendGuildSettingsInitCompleted(): void {
        this.channel.send({
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
        factions: Dal.Types.ActivityCacheItem[]
    ): RichEmbed {
        let embed = new RichEmbed()
            .setThumbnail('https://i.imgur.com/5L7T68j.png')
            .setTimestamp(new Date())
            .setFooter('kuBot', 'https://i.imgur.com/5L7T68j.png')
            .setColor(3447003)
            .setDescription('An unusually high activity has been reported');

        factions.forEach(faction => {
            embed.addField(faction.name, `${faction.playersCount} ${this.GetProperQuantifiedSubstantive('player', faction.playersCount)}`);
        });

        return embed;
    }

    public static async UpdateActivityNotice(
        message: Message,
        factions: Dal.Types.ActivityCacheItem[]
    ): Promise<void> {
        await message.edit(this.GenerateActivityNotice(factions));
    }

    public static async SendActivityNotice(
        emergencyChannel: TextChannel,
        factions: Dal.Types.ActivityCacheItem[]
    ): Promise<string> {
        let message = await emergencyChannel.send({
            embed: this.GenerateActivityNotice(factions)
        });

        return (<Message>message).id;
    }
    /* ---------------------------------------------------------------------------------------------------------------
       Scan command
       ---------------------------------------------------------------------------------------------------------------*/
    public static SendScanResponse(
        playersCount: number,
        factions: ScannedFaction[],
        regions: ScannedRegion[]
    ) : void {
        let embed = this.GenerateGeneric()
            .setColor(3447003)
            .setTitle(`**${playersCount} ${this.GetProperQuantifiedSubstantive('player', playersCount)} online**\n\n`)
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

            embed.addField(`**${region.name}** : ${region.playersCount} ${this.GetProperQuantifiedSubstantive('player', region.playersCount)}`, watch);
        });

        this.channel.send({
            embed: embed
        });
    }
    /* ---------------------------------------------------------------------------------------------------------------
       Quote command
       ---------------------------------------------------------------------------------------------------------------*/
    private static GenerateQuote(
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

    public static SendQuote(
        user: string,
        quoteSendDate: Date,
        quoteAuthor: string,
        quoteContent: string
    ) : void {
        this.channel.send({
            embed: this.GenerateQuote(user, quoteSendDate, quoteAuthor, quoteContent)
        });
    }
    /* ---------------------------------------------------------------------------------------------------------------
       QuoteText command
       ---------------------------------------------------------------------------------------------------------------*/
    private static GenerateQuoteText(
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

    public static SendQuoteText(
        user: string,
        quoteContent: string
    ) : void {
        this.channel.send({
            embed: this.GenerateQuoteText(user, quoteContent)
        });
    }
    /* ---------------------------------------------------------------------------------------------------------------
       Embed command
       ---------------------------------------------------------------------------------------------------------------*/
    private static GenerateEmbed(
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

    public static SendEmbed(
        user: string,
        title: string,
        content: string
    ) : void {
        this.channel.send({
            embed: this.GenerateEmbed(user, title, content)
        });
    }
    /* ---------------------------------------------------------------------------------------------------------------
       Watch command
       ---------------------------------------------------------------------------------------------------------------*/
    public static SendFactionPlayerWatchError(
        name: string,
        factions: string
    ) : void {
        this.channel.send({
            embed: this.GenerateGeneric()
                .setColor(10684167)
                .setAuthor(this.authorName, this.authorAvatarUrl)
                .setTitle('Error')
                .setDescription(`${name} is already under watch for belonging to the following faction(s) :\n\n${factions}`)
        });
    }

    public static SendWatchResponse(
        name: string
    ) : void {
        this.channel.send({
            embed: this.GenerateGeneric()
            .setColor(3447003)
                .setAuthor(this.authorName, this.authorAvatarUrl)
                .setTitle(`${this.guildSettings.acknowledged}`)
                .setDescription(`${name} added to the watch list`)
        });
    }
    /* ---------------------------------------------------------------------------------------------------------------
       Show command
       ---------------------------------------------------------------------------------------------------------------*/
    public static SendShowResponse(
        count: number,
        description: string,
        type: string
    ) : void {
        this.channel.send({
            embed: this.GenerateGeneric()
            .setColor(3447003)
            .setTitle(`**${count} ${type} in watch list**\n\n`)
            .setDescription(description)
        });
    }
    /* ---------------------------------------------------------------------------------------------------------------
       Remove admin command
       ---------------------------------------------------------------------------------------------------------------*/
    public static SendRemoveResponse(
        term: string,
        type: string
    ) : void {
        this.channel.send({
            embed: this.GenerateGeneric()
            .setColor(3447003)
                .setAuthor(this.authorName, this.authorAvatarUrl)
                .setTitle(`${this.guildSettings.acknowledged}`)
            .setDescription(`${term} was removed from ${type} watch list`)
        });
    }

    public static SendRemovalFailure(
        term: string,
        type: string
    ) : void {
        this.channel.send({
            embed: this.GenerateGeneric()
                .setColor(10684167)
                .setAuthor(this.authorName, this.authorAvatarUrl)
                .setTitle('Request failure')
                .setDescription(`${term} isn't defined in ${type} watch list`)
        });
    }
    /* ---------------------------------------------------------------------------------------------------------------
       Help command
       ---------------------------------------------------------------------------------------------------------------*/
    public static SendHelpResponse(commandsPrefix: string): void {
        this.channel.send({
            embed: this.CommandsDescription(
                this.GenerateGeneric()
                    .setTitle('KuBot is monitoring Sirius Sector for you!')
                    .setDescription('I am doing my best to answer your requests. Please take a look at the following commands :'),
                commandsPrefix
            )
        });
    }
    public static SendHelpAdminResponse(commandsPrefix: string): void {
        this.channel.send({
            embed: this.CommandsDescriptionAdmin(
                this.GenerateGeneric()
                    .setTitle('Admin commands'),
                commandsPrefix
            )
        });
    }
    /* ---------------------------------------------------------------------------------------------------------------
       Misc
       ---------------------------------------------------------------------------------------------------------------*/
    private static GetProperQuantifiedSubstantive(
        name: string,
        quantity: number
    ): string {
        if (quantity == 0 || quantity > 1) {
            return name + 's';
        } else {
            return name;
        }
    }
}