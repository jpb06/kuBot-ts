﻿import { Client, GuildChannel } from 'discord.js';

import * as Dal from 'kubot-dal';

import { GuildConfigurationValidator } from './../data/guild.config.validator';

export abstract class GuildConfigurationService {

    public static guildsSettings: Dal.Types.GuildConfiguration[] = [];

    public static async Initialize(
        client: Client
    ): Promise<void> {
        this.guildsSettings = [];

        const persistedParams = await Dal.Manipulation.GuildsStore.getAll();

        client.guilds.cache.forEach(async (guild) => {
            const persistedGuildParams = persistedParams.find(g => g.guildId === guild.id) as Dal.Types.GuildConfiguration;

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
                activityNoticeMinPlayers: persistedGuildParams.activityNoticeMinPlayers,
                activityNoticeMessages: persistedGuildParams.activityNoticeMessages,
                commandsPrefix: persistedGuildParams.commandsPrefix

            });
        });
    }

    public static async UpdateFromJson(
        guildId: string,
        channels: GuildChannel[],
        json: string
    ): Promise<boolean> {

        let parsed;
        try {
            parsed = JSON.parse(json);
        } catch (parsingError) {
            const error = new Error(`Failed to parse JSON:\n${parsingError.message}`);
            error.name = 'Custom';
            throw error;
        }

        const validationErrors = GuildConfigurationValidator.VerifyGuildConfig(parsed);

        if (validationErrors.length > 0) {
            const error = new Error(validationErrors);
            error.name = 'Custom';
            throw error;
        }

        this.CheckChannel(parsed.guildSettings.mainChannelName, channels);
        this.CheckChannel(parsed.guildSettings.emergencyChannelName, channels);

        await Dal.Manipulation.FactionWatchStore.set(guildId, parsed.factions.map((faction: any) => ({
            guildId: guildId,
            name: faction.name,
            tags: faction.tags,
            alwaysDisplay: faction.alwaysDisplay ? faction.alwaysDisplay : false
        })));

        await Dal.Manipulation.RegionWatchStore.set(guildId, parsed.regions.map((region: any) => ({
            guildId: guildId,
            name: region.name,
            systems: region.systems,
            alwaysDisplay: region.alwaysDisplay ? region.alwaysDisplay : false,
            showPlayers: region.showPlayers? region.showPlayers : false
        })));

        parsed.guildSettings.guildId = guildId;
        await Dal.Manipulation.GuildsStore.set(parsed.guildSettings);

        const settingsIndex = this.guildsSettings.findIndex(el => el.guildId === guildId);

        this.guildsSettings[settingsIndex] = {
            guildId: guildId,
            adminChannelName: parsed.guildSettings.adminChannelName,
            mainChannelName: parsed.guildSettings.mainChannelName,
            emergencyChannelName: parsed.guildSettings.emergencyChannelName,
            scanMainRegionName: parsed.guildSettings.scanMainRegionName,
            messagesImage: parsed.guildSettings.messagesImage,
            messagesFooterName: parsed.guildSettings.messagesFooterName,
            acknowledged: parsed.guildSettings.acknowledged,
            activityNoticeMinPlayers: parsed.guildSettings.activityNoticeMinPlayers,
            activityNoticeMessages: parsed.guildSettings.activityNoticeMessages,
            commandsPrefix: parsed.guildSettings.commandsPrefix
        };

        return true;
    }

    public static remove(
        guildId: string
    ): void {
        this.guildsSettings = this.guildsSettings.filter(guildConfig => guildConfig.guildId !== guildId);
    }

    private static CheckChannel(
        name: string,
        channels: GuildChannel[]
    ): void {

        const channel = channels.find(channel => channel.name === name);

        if (channel === undefined) {
            const error = new Error(`Channel ${name} doesn't exist in this guild.`);
            error.name = 'Custom';
            throw error;
        }
        if (channel.type !== 'text') {
            const error = new Error(`Channel ${name} is not a text channel.`);
            error.name = 'Custom';
            throw error;
        }
    }       
}