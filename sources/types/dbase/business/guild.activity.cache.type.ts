import { ActivityCacheItem, isActivityCacheItem } from './activity.cache.item.type';

export interface GuildActivityCache {
    GuildId: string;
    Cache: Array<ActivityCacheItem>;
}

export function isGuildActivityCache(obj: any): obj is GuildActivityCache {
    if (typeof obj.GuildId !== "string" || !Array.isArray(obj.Cache)) {
        return false;
    }

    for (let i = 0; i < obj.Cache.length; i++) {
        if (!isActivityCacheItem(obj.Cache[i])) return false;
    }

    return true;
}