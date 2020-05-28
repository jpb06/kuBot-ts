import { Client, TextChannel } from 'discord.js';
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
            const rule = new Schedule.RecurrenceRule();
            rule.minute = new Schedule.Range(0, 59, 30);

            this.job = Schedule.scheduleJob(rule, async () => {
                this.onlinePlayers = await OnlinePlayersService.GetList();
                this.watchedFactions = await Dal.Manipulation.FactionWatchStore.getAll();
                this.watchedRegions = await Dal.Manipulation.RegionWatchStore.getAll();
                this.watchedPlayers = await Dal.Manipulation.PlayerWatchStore.getAll();
                const activityCache = await Dal.Manipulation.ActivityCacheStore.getAll();

                const updatedCache: Dal.Types.GuildActivityCache[] = [];

                await this.AsyncForEach(GuildConfigurationService.guildsSettings, async (guildConfiguration) => {
                    let messageId = '';

                    const currentActivity = this.BuildCurrentActivity(guildConfiguration.guildId);

                    const playersCount = currentActivity.map(el => el.playersCount).reduce((a, b) => a + b, 0);
                    if (playersCount >= guildConfiguration.activityNoticeMinPlayers) {

                        const cachedActivity = activityCache.find(cache => cache.guildId === guildConfiguration.guildId);
                        const similar = await this.CompareActivity(cachedActivity, currentActivity);


                        if (currentActivity.length > 0 && !similar) {
                            const guild = client.guilds.cache.find(guild => guild.id === guildConfiguration.guildId);
                            if (guild !== undefined) {
                                const emergencyChannel = guild.channels.cache.find(channel => channel.name === guildConfiguration.emergencyChannelName && channel.type === 'text');
                                if (emergencyChannel !== undefined && emergencyChannel instanceof TextChannel) {
                                    const messageIndex = Math.floor((Math.random() * guildConfiguration.activityNoticeMessages.length));
                                    const message = guildConfiguration.activityNoticeMessages[messageIndex];

                                    messageId = await this.ReportActivity(
                                        emergencyChannel, currentActivity, cachedActivity,
                                        message, guildConfiguration.messagesImage, guildConfiguration.messagesFooterName
                                    );
                                } else {
                                    console.log(`couldn't locate emergency for:${guildConfiguration.guildId}`);
                                    //console.log(guild.channels);
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

        const activity: Dal.Types.ActivityCacheItem[] = [];

        const guildWatchedFactions = this.watchedFactions
            .filter(faction => faction.guildId === guildId)
            .sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });

        const guildWatchedRegions = this.watchedRegions.filter(region => region.guildId === guildId);
        const systems = ([] as string[]).concat(...guildWatchedRegions.map(region => region.systems));

        guildWatchedFactions.forEach(faction => {

            const factionOnlinePlayers = this.onlinePlayers.filter(player =>
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

        const guildWatchedPlayers = this.watchedPlayers.filter(player => player.guildId === guildId).map(player => player.name);
        const onlineWatchedPlayers = this.onlinePlayers.filter(player =>
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
            const cachedFaction = activityInCache.cache[index];
            const fetchedFaction = activityFetched[index];

            if (fetchedFaction.name !== cachedFaction.name ||
                fetchedFaction.playersCount !== cachedFaction.playersCount)
                return false;
        }

        return true;
    }

    private static async ReportActivity(
        emergencyChannel: TextChannel,
        currentActivity: Dal.Types.ActivityCacheItem[],
        cachedActivity: Dal.Types.GuildActivityCache | undefined,
        activityNoticemessage: string,
        activityNoticeImageUrl: string,
        activityNoticeFooterName: string
    ): Promise<string> {
        let messageId = '';

        const cachedLastMessageId = cachedActivity === undefined ? '-1' : cachedActivity.lastMessageId;

        const message = emergencyChannel.lastMessage;
        if (message) {
            if (message.author.id === process.env['botId'] && message.id === cachedLastMessageId) {
                await EmbedHelper.UpdateActivityNotice(message, currentActivity, activityNoticemessage, activityNoticeImageUrl, activityNoticeFooterName);
                messageId = message.id;
            }

            if (messageId === '') {
                messageId = await EmbedHelper.SendActivityNotice(emergencyChannel, currentActivity, activityNoticemessage, activityNoticeImageUrl, activityNoticeFooterName);
            }
        }

        return messageId;
    }
}