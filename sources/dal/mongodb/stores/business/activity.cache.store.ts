﻿import { GenericStore } from './../dal.generic.store';
import { GuildActivityCache } from './../../../../types/dbase/business/guild.activity.cache.type';

export abstract class ActivityCacheStore {
    public static storeName = 'activitystatuscache';

    public static async set(cache: Array<GuildActivityCache>): Promise<boolean> {
        let result = await GenericStore.clearAllAndCreateMany(ActivityCacheStore.storeName, cache);

        return result;
    }

    public static async getAll(): Promise<Array<GuildActivityCache>> {
        let result = await GenericStore.getAll(ActivityCacheStore.storeName) as Array<GuildActivityCache>;

        return result;
    }

    public static async get(guildId: string): Promise<GuildActivityCache> {
        let result = await GenericStore.getBy(
            ActivityCacheStore.storeName,
            { guildId: guildId }) as Array<GuildActivityCache>;

        return result[0];
    }

}