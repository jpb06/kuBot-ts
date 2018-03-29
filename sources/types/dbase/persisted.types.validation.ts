import * as PersistedTypes from './persisted.types';

/* ---------------------------------------------------------------------------------------------------------------
   Activity Cache
   ---------------------------------------------------------------------------------------------------------------*/

export function isActivityCacheItem(obj: any): obj is PersistedTypes.ActivityCacheItem {
    return (
        typeof obj.name === "string" &&
        typeof obj.playersCount === "number"
    );
}

export function isGuildActivityCache(obj: any): obj is PersistedTypes.GuildActivityCache {
    if (typeof obj.GuildId !== "string" || !Array.isArray(obj.Cache)) {
        return false;
    }

    for (let i = 0; i < obj.Cache.length; i++) {
        if (!isActivityCacheItem(obj.Cache[i])) return false;
    }

    return true;
}

/* ---------------------------------------------------------------------------------------------------------------
   Guild Configuration
   ---------------------------------------------------------------------------------------------------------------*/

export function isGuildConfiguration(obj: any): obj is PersistedTypes.GuildConfiguration {
    return (
        typeof obj.guildId === "string" &&
        typeof obj.messagesImage === "string" &&
        typeof obj.messagesFooterName === "string" &&
        typeof obj.scanMainRegionName === "string" &&
        typeof obj.mainChannel === "string" &&
        typeof obj.adminChannel === "string" &&
        typeof obj.emergencyChannel === "string" &&
        typeof obj.acknowledged === "string"
    );
}

/* ---------------------------------------------------------------------------------------------------------------
   Last Fetch
   ---------------------------------------------------------------------------------------------------------------*/

export function isLastFetch(obj: any): obj is PersistedTypes.LastFetch {
    return (
        typeof obj.target === "string" &&
        typeof obj.date === "string"
    );
}

/* ---------------------------------------------------------------------------------------------------------------
   Online Player
   ---------------------------------------------------------------------------------------------------------------*/

export function isOnlinePlayer(obj: any): obj is PersistedTypes.OnlinePlayer {
    return (
        typeof obj.Time === "string" &&
        typeof obj.Name === "string" &&
        typeof obj.System === "string" &&
        typeof obj.Region === "string" &&
        typeof obj.Ping === "number"
    );
}

/* ---------------------------------------------------------------------------------------------------------------
   Watched Faction
   ---------------------------------------------------------------------------------------------------------------*/

export function isWatchedFaction(obj: any): obj is PersistedTypes.WatchedFaction {
    if (typeof obj.guildId !== "string" ||
        typeof obj.name !== "string" ||
        typeof obj.alwaysDisplay !== "boolean" ||
        !Array.isArray(obj.tags)) {
        return false;
    }

    for (let i = 0; i < obj.tags.length; i++) {
        if (typeof obj.tags[i] !== "string") return false;
    }

    return true;
}

/* ---------------------------------------------------------------------------------------------------------------
   Watched Player
   ---------------------------------------------------------------------------------------------------------------*/

export function isWatchedPlayer(obj: any): obj is PersistedTypes.WatchedPlayer {
    if (typeof obj.guildId !== "string" ||
        typeof obj.name !== "string" ||
        typeof obj.comment !== "string")
        return false;

    return true;
}

/* ---------------------------------------------------------------------------------------------------------------
   Watched Region
   ---------------------------------------------------------------------------------------------------------------*/

export function isWatchedRegion(obj: any): obj is PersistedTypes.WatchedRegion {
    if (typeof obj.guildId !== "string" ||
        typeof obj.name !== "string" ||
        typeof obj.alwaysDisplay !== "boolean" ||
        !Array.isArray(obj.systems)) {
        return false;
    }

    for (let i = 0; i < obj.systems.length; i++) {
        if (typeof obj.systems[i] !== "string") return false;
    }

    return true;
}