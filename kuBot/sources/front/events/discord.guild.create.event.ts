﻿import { Guild } from 'discord.js';
import * as Dal from 'kubot-dal';

import { GuildConfigurationService } from './../../businesslogic/services/guild.configuration.service';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class GuildCreateEvent {

    private static GetDefaultSettings(
        guildId: string
    ): Dal.Types.GuildConfiguration {

        let defaultSettings: Dal.Types.GuildConfiguration = {
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

                await Dal.Manipulation.GuildsStore.set(defaultSettings);
                GuildConfigurationService.guildsSettings.push({
                    guildId: guild.id,
                    adminChannelName: defaultSettings.adminChannelName,
                    mainChannelName: defaultSettings.mainChannelName,
                    emergencyChannelName: defaultSettings.emergencyChannelName,
                    scanMainRegionName: defaultSettings.scanMainRegionName,
                    messagesImage: defaultSettings.messagesImage,
                    messagesFooterName: defaultSettings.messagesFooterName,
                    acknowledged: defaultSettings.acknowledged,
                    activityNoticeMinPlayers: defaultSettings.activityNoticeMinPlayers
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