import { Message, TextChannel } from 'discord.js';
import * as fs from 'fs';
import { promisify } from 'util';

import { FactionWatchStore } from './../../dal/mongodb/stores/watchlists/faction.watch.store';
import { RegionWatchStore } from './../../dal/mongodb/stores/watchlists/region.watch.store';
import { GuildsStore } from './../../dal/mongodb/stores/business/guilds.store';

import * as FileUtil from './../util/files.helper';
import { GuildConfigurationValidator } from './../data/guild.config.validator';
import { EmbedHelper } from './../../businesslogic/util/embed.helper';

export async function persist(
    message: Message
): Promise<boolean> {
    let attachment = message.attachments.first();

    let fileExtension = attachment.filename.substr(attachment.filename.lastIndexOf('.') + 1);
    if (fileExtension === 'json') {
        let channel = <TextChannel>message.channel;

        await FileUtil.save(attachment.url, `./dal/guildsconfiguration/${channel.guild.id}.json`);

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
                identifier: faction.identifier ? faction.identifier : faction.name.replace(/\W/g, ''),
                name: faction.name,
                tags: faction.tags,
                alwaysDisplay: faction.alwaysDisplay ? faction.alwaysDisplay : false
            })));

            await RegionWatchStore.set(channel.guild.id, parsed.regions.map(region => ({
                guildId: channel.guild.id,
                identifier: region.identifier ? region.identifier : region.name.replace(/\W/g, ''),
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