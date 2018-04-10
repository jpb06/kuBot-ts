import { TextChannel } from 'discord.js';
import * as Schedule from 'node-schedule';

import { MappedGuildConfiguration } from './../../types/businesslogic/business.types';
import { GuildActivityCache, ActivityCacheItem, WatchedFaction, WatchedRegion, WatchedPlayer, OnlinePlayer } from './../../types/dbase/persisted.types';

import { OnlinePlayersService } from './../../businesslogic/services/online.players.service';
import { GuildConfigurationService } from './../../businesslogic/services/guild.configuration.service';

import { FactionWatchStore } from './../../dal/mongodb/stores/watchlists/faction.watch.store';
import { RegionWatchStore } from './../../dal/mongodb/stores/watchlists/region.watch.store';
import { PlayerWatchStore } from './../../dal/mongodb/stores/watchlists/player.watch.store';
import { ActivityCacheStore } from './../../dal/mongodb/stores/business/activity.cache.store';

import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class CyclicActivityNotice {

    private static job: Schedule.Job;
    private static watchedFactions: WatchedFaction[];
    private static watchedRegions: WatchedRegion[];
    private static watchedPlayers: WatchedPlayer[];
    private static onlinePlayers: OnlinePlayer[];

    public static async Start(): Promise<void> {
        try {
            let rule = new Schedule.RecurrenceRule();
            rule.minute = new Schedule.Range(0, 59, 30);

            this.job = Schedule.scheduleJob(rule, async () => {

                this.onlinePlayers = await OnlinePlayersService.GetList();
                this.watchedFactions = await FactionWatchStore.getAll();
                this.watchedRegions = await RegionWatchStore.getAll();
                this.watchedPlayers = await PlayerWatchStore.getAll();
                let activityCache = await ActivityCacheStore.getAll();

                let updatedCache: GuildActivityCache[] = [];

                await this.AsyncForEach(GuildConfigurationService.guildsSettings, async (guildConfiguration) => {
                    let messageId = '';

                    let currentActivity = this.BuildCurrentActivity(guildConfiguration.guildId);

                    let playersCount = currentActivity.map(el => el.playersCount).reduce((a, b) => a + b, 0);
                    if (playersCount >= guildConfiguration.activityNoticeMinPlayers) {

                        let cachedActivity = activityCache.find(cache => cache.guildId === guildConfiguration.guildId);
                        let similar = await this.CompareActivity(cachedActivity, currentActivity);

                        
                        if (currentActivity.length > 0 && !similar) {
                            messageId = await this.ReportActivity(cachedActivity, guildConfiguration.emergencyChannel as TextChannel, currentActivity);
                        }
                    }

                    updatedCache.push({
                        guildId: guildConfiguration.guildId,
                        lastMessageId: messageId,
                        cache: currentActivity
                    });
                });

                await ActivityCacheStore.set(updatedCache);
            });
        } catch (error) {
            await ErrorsLogging.Save(error);
        }
    }

    public static Stop(): void {
        this.job.cancel();
    }

    private static async AsyncForEach(
        array: MappedGuildConfiguration[],
        callback: (config: MappedGuildConfiguration) => Promise<void>
    ): Promise<void> {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index]);
        }
    }

    private static BuildCurrentActivity(
        guildId: string
    ): ActivityCacheItem[] {

        let activity: ActivityCacheItem[] = [];

        let guildWatchedFactions = this.watchedFactions
            .filter(faction => faction.guildId === guildId)
            .sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });

        let guildWatchedRegions = this.watchedRegions.filter(region => region.guildId === guildId);
        let systems = ([] as string[]).concat(...guildWatchedRegions.map(region => region.systems));

        guildWatchedFactions.forEach(faction => {

            let factionOnlinePlayers = this.onlinePlayers.filter(player =>
                faction.tags.some(tag => player.Name.includes(tag)) &&
                systems.some(el => el === player.System)
            );

            if (factionOnlinePlayers.length > 0) {
                activity.push({
                    name: faction.name,
                    playersCount: factionOnlinePlayers.length
                });
            }
        });

        let guildWatchedPlayers = this.watchedPlayers.filter(player => player.guildId === guildId).map(player => player.name);
        let onlineWatchedPlayers = this.onlinePlayers.filter(player =>
            systems.some(el => el === player.System) &&
            guildWatchedPlayers.some(watchedPlayer => watchedPlayer === player.Name)
        );

        if (onlineWatchedPlayers.length > 0) {
            activity.push({
                name: 'Individuals of interest',
                playersCount: onlineWatchedPlayers.length
            });
        }

        return activity;
    }

    private static async CompareActivity(
        activityInCache: GuildActivityCache | undefined,
        activityFetched: ActivityCacheItem[]
    ): Promise<boolean> {
        if (activityInCache === undefined) return false;
        if (activityInCache.cache.length !== activityFetched.length) return false;

        for (let index = 0; index < activityInCache.cache.length; index++) {
            let cachedFaction = activityInCache.cache[index];
            let fetchedFaction = activityFetched[index];

            if (fetchedFaction.name !== cachedFaction.name ||
                fetchedFaction.playersCount !== cachedFaction.playersCount)
                return false;
        }

        return true;
    }

    private static async ReportActivity(
        cachedActivity: GuildActivityCache | undefined,
        emergencyChannel: TextChannel,
        currentActivity: ActivityCacheItem[]
    ): Promise<string> {
        let messageId = '';

        let cachedLastMessageId = cachedActivity === undefined ? '-1' : (<GuildActivityCache>cachedActivity).lastMessageId;

        let messages = await emergencyChannel.fetchMessages({
            limit: 1
        });

        if (messages.size > 0) {
            let message = messages.first();

            if (message.author.id === process.env.botId && message.id === cachedLastMessageId) {
                await EmbedHelper.UpdateActivityNotice(message, currentActivity);
                messageId = message.id;
            }
        }

        if (messageId === '') {
            messageId = await EmbedHelper.SendActivityNotice(emergencyChannel, currentActivity);
        }

        return messageId;
    }
}