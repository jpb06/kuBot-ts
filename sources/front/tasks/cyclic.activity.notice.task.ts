import { TextChannel } from 'discord.js';
import * as Schedule from 'node-schedule';

import { MappedGuildConfiguration } from './../../types/businesslogic/business.types';
import { GuildActivityCache, ActivityCacheItem, WatchedFaction, WatchedRegion, OnlinePlayer } from './../../types/dbase/persisted.types';

import { OnlinePlayersService } from './../../businesslogic/services/online.players.service';

import { FactionWatchStore } from './../../dal/mongodb/stores/watchlists/faction.watch.store';
import { RegionWatchStore } from './../../dal/mongodb/stores/watchlists/region.watch.store';
import { ActivityCacheStore } from './../../dal/mongodb/stores/business/activity.cache.store';

import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class CyclicActivityNotice {

    private static job: Schedule.Job;
    private static watchedFactions: WatchedFaction[];
    private static watchedRegions: WatchedRegion[];
    private static onlinePlayers: OnlinePlayer[];

    public static async Start(guildsConfiguration: MappedGuildConfiguration[]) {
        try {
            let rule = new Schedule.RecurrenceRule();
            rule.minute = new Schedule.Range(0, 59, 30);

            this.job = Schedule.scheduleJob(rule, async () => {

                this.onlinePlayers = await OnlinePlayersService.GetList();
                this.watchedFactions = await FactionWatchStore.getAll();
                this.watchedRegions = await RegionWatchStore.getAll();
                let activityCache = await ActivityCacheStore.getAll();

                let updatedCache: GuildActivityCache[] = [];

                await this.AsyncForEach(guildsConfiguration, async (guildConfiguration) => {

                    let currentActivity = this.BuildCurrentActivity(guildConfiguration.id);
                    let cachedActivity = activityCache.find(cache => cache.guildId === guildConfiguration.id);

                    let similar = await this.CompareActivity(cachedActivity, currentActivity);

                    let messageId = '';
                    if (currentActivity.length > 0 && !similar) {
                        messageId = await this.ReportActivity(cachedActivity, guildConfiguration.emergencyChannel as TextChannel, currentActivity);
                    }

                    updatedCache.push({
                        guildId: guildConfiguration.id,
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

        let factionsActivity: ActivityCacheItem[] = [];

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

            if (factionOnlinePlayers.length >= 2) {
                factionsActivity.push({
                    name: faction.name,
                    playersCount: factionOnlinePlayers.length
                });
            }
        });

        return factionsActivity;
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

        let cachedLastMessageId = cachedActivity === undefined ? '0' : (<GuildActivityCache>cachedActivity).lastMessageId;

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