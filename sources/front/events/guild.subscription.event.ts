import { Guild } from 'discord.js';

import { GuildConfiguration } from './../../types/dbase/persisted.types';
import { GuildsStore } from './../../dal/mongodb/stores/business/guilds.store';

import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class GuildSubscription {

    private static GetDefaultSettings(
        guildId: string
    ): GuildConfiguration {

        let defaultSettings: GuildConfiguration = {
            guildId: guildId,
            messagesImage: 'https://i.imgur.com/5L7T68j.png',
            messagesFooterName: 'kuBot',
            scanMainRegionName: 'Sirius Sector',
            acknowledged: 'Understood!',
            mainChannel: 'bots',
            adminChannel: 'admin',
            emergencyChannel: 'emergency',
            activityNoticeMinPlayers: 3
        };

        return defaultSettings;
    }

    public static async Subscribe(
        guild: Guild,
        guildsParameters: GuildConfiguration[]
    ): Promise<GuildConfiguration[]> {
        try {
            console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);

            if (guildsParameters.filter(configuredGuild => configuredGuild.guildId === guild.id).length === 0) {
                let defaultSettings = this.GetDefaultSettings(guild.id);

                await GuildsStore.set(defaultSettings);
                guildsParameters.push(defaultSettings);
            }

            return guildsParameters;

        } catch (err) {
            await ErrorsLogging.Save(err);
            throw err;
        }
    }
}
