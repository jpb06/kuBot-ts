﻿import { Client, GuildChannel } from 'discord.js';
import { promisify } from 'util';

import { FactionWatchStore } from './../../dal/mongodb/stores/watchlists/faction.watch.store';
import { RegionWatchStore } from './../../dal/mongodb/stores/watchlists/region.watch.store';
import { GuildsStore } from './../../dal/mongodb/stores/business/guilds.store';
import { GuildConfiguration } from './../../types/dbase/persisted.types';

import { GuildConfigurationValidator } from './../data/guild.config.validator';

export abstract class GuildConfigurationService {

    public static guildsSettings: GuildConfiguration[] = [];

    public static async Initialize(
        client: Client
    ): Promise<void> {
        let persistedParams = await GuildsStore.getAll();

        client.guilds.forEach(async (guild) => {
            let persistedGuildParams = <GuildConfiguration>persistedParams.find(g => g.guildId === guild.id);

            if (persistedGuildParams === undefined) {
                throw new Error(`Couldn't find settings for guild ${guild.id}`);
            }

            this.guildsSettings.push({
                guildId: guild.id,
                adminChannelName: persistedGuildParams.adminChannelName,
                mainChannelName: persistedGuildParams.mainChannelName,
                emergencyChannelName: persistedGuildParams.emergencyChannelName,
                scanMainRegionName: persistedGuildParams.scanMainRegionName,
                messagesImage: persistedGuildParams.messagesImage,
                messagesFooterName: persistedGuildParams.messagesFooterName,
                acknowledged: persistedGuildParams.acknowledged,
                activityNoticeMinPlayers: persistedGuildParams.activityNoticeMinPlayers

            });
        });
    }

    public static async UpdateFromJson(
        guildId: string,
        channels: GuildChannel[],
        json: string
    ): Promise<boolean> {

        let parsed = JSON.parse(json);

        let validationErrors = GuildConfigurationValidator.VerifyGuildConfig(parsed);

        if (validationErrors.length > 0) {
            let error = new Error(validationErrors);
            error.name = 'Custom';
            throw error;
        }

        this.CheckChannel(parsed.guildSettings.mainChannelName, channels);
        this.CheckChannel(parsed.guildSettings.emergencyChannelName, channels);

        await FactionWatchStore.set(guildId, parsed.factions.map((faction: any) => ({
            guildId: guildId,
            name: faction.name,
            tags: faction.tags,
            alwaysDisplay: faction.alwaysDisplay ? faction.alwaysDisplay : false
        })));

        await RegionWatchStore.set(guildId, parsed.regions.map((region: any) => ({
            guildId: guildId,
            name: region.name,
            systems: region.systems,
            alwaysDisplay: region.alwaysDisplay ? region.alwaysDisplay : false
        })));

        parsed.guildSettings.guildId = guildId;
        await GuildsStore.set(parsed.guildSettings);

        let settingsIndex = this.guildsSettings.findIndex(el => el.guildId === guildId);

        this.guildsSettings[settingsIndex] = {
            guildId: guildId,
            adminChannelName: parsed.guildSettings.adminChannelName,
            mainChannelName: parsed.guildSettings.mainChannelName,
            emergencyChannelName: parsed.guildSettings.emergencyChannelName,
            scanMainRegionName: parsed.guildSettings.scanMainRegionName,
            messagesImage: parsed.guildSettings.messagesImage,
            messagesFooterName: parsed.guildSettings.messagesFooterName,
            acknowledged: parsed.guildSettings.acknowledged,
            activityNoticeMinPlayers: parsed.guildSettings.activityNoticeMinPlayers
        };

        return true;
    }

    private static CheckChannel(
        name: string,
        channels: GuildChannel[]
    ): void {

        let channel = channels.find(channel => channel.name === name);

        if (channel === undefined) {
            let error = new Error(`Channel ${name} doesn't exist in this guild.`);
            error.name = 'Custom';
            throw error;
        }
        if (channel.type !== 'text') {
            let error = new Error(`Channel ${name} is not a text channel.`);
            error.name = 'Custom';
            throw error;
        }
    }       
}