import { Guild } from 'discord.js';

import { GuildConfiguration } from './../../types/dbase/persisted.types';
import { GuildConfigurationService } from './../../businesslogic/services/guild.configuration.service';
import { GuildsStore } from './../../dal/mongodb/stores/business/guilds.store';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class GuildCreateEvent {

    private static GetDefaultSettings(
        guildId: string
    ): GuildConfiguration {

        let defaultSettings: GuildConfiguration = {
            guildId: guildId,
            messagesImage: 'https://i.imgur.com/5L7T68j.png',
            messagesFooterName: 'kuBot',
            scanMainRegionName: 'Sirius Sector',
            acknowledged: 'Understood!',
            mainChannelName: 'bots',
            adminChannelName: 'admin',
            emergencyChannelName: 'emergency',
            activityNoticeMinPlayers: 3
        };

        return defaultSettings;
    }

    public static async React(
        guild: Guild
    ): Promise<void> {
        try {
            console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);

            if (GuildConfigurationService.guildsSettings.filter(configuredGuild => configuredGuild.guildId === guild.id).length === 0) {
                let defaultSettings = this.GetDefaultSettings(guild.id);

                await GuildsStore.set(defaultSettings);
                GuildConfigurationService.guildsSettings.push({
                    guildId: guild.id,
                    adminChannelName: defaultSettings.adminChannelName,
                    mainChannelName: defaultSettings.mainChannelName,
                    emergencyChannelName: defaultSettings.emergencyChannelName,
                    scanMainRegionName: defaultSettings.scanMainRegionName,
                    messagesImage: defaultSettings.messagesImage,
                    messagesFooterName: defaultSettings.messagesFooterName,
                    acknowledged: defaultSettings.acknowledged,
                    activityNoticeMinPlayers: defaultSettings.activityNoticeMinPlayers,

                    defaultChannel: guild.channels.find(channel => channel.name === defaultSettings.mainChannelName),
                    emergencyChannel: guild.channels.find(channel => channel.name === defaultSettings.emergencyChannelName),
                });
            }
            else {
                throw new Error('The configuration for this guild already exists');
            }
        } catch (err) {
            await ErrorsLogging.Save(err);
        }
    }
}