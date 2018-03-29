import { Guild, Message, TextChannel } from 'discord.js';
import * as fs from 'fs';
import { promisify } from 'util';

import { FactionWatchStore } from './../../dal/mongodb/stores/watchlists/faction.watch.store';
import { RegionWatchStore } from './../../dal/mongodb/stores/watchlists/region.watch.store';
import { GuildsStore } from './../../dal/mongodb/stores/business/guilds.store';
import { MappedGuildConfiguration } from './../../types/businesslogic/business.types';
import { GuildConfiguration } from './../../types/dbase/persisted.types';

import { FilesHelper } from './../util/files.helper';
import { GuildConfigurationValidator } from './../data/guild.config.validator';
import { EmbedHelper } from './../../businesslogic/util/embed.helper';

export abstract class GuildConfigService {

    public static async Initialize(
        guild: Guild,
        guildsSettings: GuildConfiguration[]
    ): Promise<MappedGuildConfiguration> {

        let guildSettings = <GuildConfiguration>guildsSettings.find(g => g.guildId === guild.id);

        if (guildSettings !== undefined) {
            return {
                id: guild.id,
                defaultChannel: guild.channels.find(channel => channel.name === guildSettings.mainChannel),
                emergencyChannel: guild.channels.find(channel => channel.name === guildSettings.emergencyChannel)
            };
        } else {
            return Promise.reject(new Error(`Couldn't find settings for guild ${guild.id}`));
        }
    }

    public static async UpdateFromUploadedJson(
        message: Message
    ): Promise<boolean> {
        let attachment = message.attachments.first();

        let fileExtension = attachment.filename.substr(attachment.filename.lastIndexOf('.') + 1);
        if (fileExtension === 'json') {
            let channel = <TextChannel>message.channel;

            await FilesHelper.Save(attachment.url, `./dal/guildsconfiguration/${channel.guild.id}.json`);

            const readFile = promisify(fs.readFile);
            let data = await readFile(`./dal/guildsconfiguration/${channel.guild.id}.json`, 'utf8');
            let parsed = JSON.parse(data.join(''));

            let validationErrors = GuildConfigurationValidator.VerifyGuildConfig(parsed);

            if (validationErrors.length > 0) {
                EmbedHelper.SendInvalidGuildConfig(channel, validationErrors);
                return false;
            } else {
                await FactionWatchStore.set(channel.guild.id, parsed.factions.map(faction => ({
                    guildId: channel.guild.id,
                    name: faction.name,
                    tags: faction.tags,
                    alwaysDisplay: faction.alwaysDisplay ? faction.alwaysDisplay : false
                })));

                await RegionWatchStore.set(channel.guild.id, parsed.regions.map(region => ({
                    guildId: channel.guild.id,
                    name: region.name,
                    systems: region.systems,
                    alwaysDisplay: region.alwaysDisplay ? region.alwaysDisplay : false
                })));

                parsed.guildSettings.guildId = channel.guild.id;
                await GuildsStore.set(parsed.guildSettings);

                EmbedHelper.SendGuildSettingsInitCompleted(channel);
                return true;
            }
        } else {
            return false;
        }
    }
}