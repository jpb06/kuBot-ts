import { RichEmbed, TextChannel } from 'discord.js';

import { Guild } from './../../types/dbase/business/guild.type';
import { ScanResultElement } from './../../types/businesslogic/scan.result.element.type';

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

    generateGeneric () {
        let embed = new RichEmbed()
            .setThumbnail(this.guildSettings.messagesImage)
            .setTimestamp(new Date())
            .setFooter(this.guildSettings.messagesFooterName, this.guildSettings.messagesImage);

        return embed;
    }

    error(channel: TextChannel) {
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

    sendScanResponse(
        playersCount: number,
        factions: ScanResultElement[],
        regions: ScanResultElement[]
    ) {
        let embed = this.generateGeneric()
            .setColor(3447003)
            .setTitle(`**${playersCount} Players online**\n\n`)
            .setDescription(`Scanning ${this.guildSettings.scanMainRegionName}...`);

        let factionsDescription = '';
        factions.forEach(faction => {
            factionsDescription += `**${faction.name}** : ${faction.count}\n`;
        });

        embed.addField('Factions', factionsDescription);

        regions.forEach(region => {
            let watch = '~';
            if (region.players.length > 0) {
                watch = '';
                region.players.forEach(player => {
                    watch += `${player.name}`;

                    if (player.comment)
                        watch += ` - ${player.comment}`;

                    watch += '\n';
                });
            }

            embed.addField(`**${region.name}** : ${region.count} players`, watch);
        });

        this.channel.send({
            embed: embed
        });
    }
}