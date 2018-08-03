import { Client, TextChannel, GuildChannel } from 'discord.js';
import * as Schedule from 'node-schedule';
import * as Dal from 'kubot-dal';

import { OnlinePlayersService } from './../../businesslogic/services/online.players.service';
import { GuildConfigurationService } from './../../businesslogic/services/guild.configuration.service';

import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class CyclicActivityNotice {

    private static job: Schedule.Job;
    private static watchedFactions: Dal.Types.WatchedFaction[];
    private static watchedRegions: Dal.Types.WatchedRegion[];
    private static watchedPlayers: Dal.Types.WatchedPlayer[];
    private static onlinePlayers: Dal.Types.OnlinePlayer[];

    public static async Start(
        client: Client
    ): Promise<void> {
        try {
            let rule = new Schedule.RecurrenceRule();
            rule.minute = new Schedule.Range(0, 59, 5);

            this.job = Schedule.scheduleJob(rule, async () => {
                this.onlinePlayers = await OnlinePlayersService.GetList();
                this.watchedFactions = await Dal.Manipulation.FactionWatchStore.getAll();
                this.watchedRegions = await Dal.Manipulation.RegionWatchStore.getAll();
                this.watchedPlayers = await Dal.Manipulation.PlayerWatchStore.getAll();
                let activityCache = await Dal.Manipulation.ActivityCacheStore.getAll();

                let updatedCache: Dal.Types.GuildActivityCache[] = [];

                await this.AsyncForEach(GuildConfigurationService.guildsSettings, async (guildConfiguration) => {
                    let messageId = '';

                    let currentActivity = this.BuildCurrentActivity(guildConfiguration.guildId);

                    let playersCount = currentActivity.map(el => el.playersCount).reduce((a, b) => a + b, 0);
                    if (playersCount >= guildConfiguration.activityNoticeMinPlayers) {

                        let cachedActivity = activityCache.find(cache => cache.guildId === guildConfiguration.guildId);
                        let similar = await this.CompareActivity(cachedActivity, currentActivity);


                        if (currentActivity.length > 0 && !similar) {
                            let guild = client.guilds.find(guild => guild.id === guildConfiguration.guildId);
                            if (guild !== undefined) {
                                let emergencyChannel: GuildChannel = guild.channels.find(channel => channel.name === guildConfiguration.emergencyChannelName && channel.type === 'text');
                                if (emergencyChannel !== undefined && emergencyChannel instanceof TextChannel) {
                                    let messageIndex = Math.floor((Math.random() * guildConfiguration.activityNoticeMessages.length));
                                    let message: string = guildConfiguration.activityNoticeMessages[messageIndex];

                                    messageId = await this.ReportActivity(cachedActivity, emergencyChannel, currentActivity, message);
                                } else {
                                    console.log(`couldn't locate emergency for:${guildConfiguration.guildId}`);
                                    console.log(guild.channels);
                                }
                            }
                        }
                    }

                    updatedCache.push({
                        guildId: guildConfiguration.guildId,
                        lastMessageId: messageId,
                        cache: currentActivity
                    });
                });

                await Dal.Manipulation.ActivityCacheStore.set(updatedCache);
            });
        } catch (error) {
            await ErrorsLogging.Save(error);
        }
    }

    public static Stop(): void {
        if (this.job instanceof Schedule.Job) {
            this.job.cancel();
        }
    }

    private static async AsyncForEach(
        array: Dal.Types.GuildConfiguration[],
        callback: (config: Dal.Types.GuildConfiguration) => Promise<void>
    ): Promise<void> {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index]);
        }
    }

    private static BuildCurrentActivity(
        guildId: string
    ): Dal.Types.ActivityCacheItem[] {

        let activity: Dal.Types.ActivityCacheItem[] = [];

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
        activityInCache: Dal.Types.GuildActivityCache | undefined,
        activityFetched: Dal.Types.ActivityCacheItem[]
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
        cachedActivity: Dal.Types.GuildActivityCache | undefined,
        emergencyChannel: TextChannel,
        currentActivity: Dal.Types.ActivityCacheItem[],
        activityNoticemessage: string
    ): Promise<string> {
        let messageId = '';

        let cachedLastMessageId = cachedActivity === undefined ? '-1' : (<Dal.Types.GuildActivityCache>cachedActivity).lastMessageId;

        let messages = await emergencyChannel.fetchMessages({
            limit: 1
        });

        if (messages.size > 0) {
            let message = messages.first();

            if (message.author.id === process.env['botId'] && message.id === cachedLastMessageId) {
                await EmbedHelper.UpdateActivityNotice(message, currentActivity, activityNoticemessage);
                messageId = message.id;
            }
        }

        if (messageId === '') {
            messageId = await EmbedHelper.SendActivityNotice(emergencyChannel, currentActivity, activityNoticemessage);
        }

        return messageId;
    }
}