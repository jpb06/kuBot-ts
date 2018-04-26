/* ---------------------------------------------------------------------------------------------------------------
   Activity Cache
   ---------------------------------------------------------------------------------------------------------------*/
export class ActivityCacheItem {
    name: string;
    playersCount: number;
}

export class GuildActivityCache {
    guildId: string;
    lastMessageId: string;
    cache: Array<ActivityCacheItem>;
}

/* ---------------------------------------------------------------------------------------------------------------
   Guild Configuration
   ---------------------------------------------------------------------------------------------------------------*/
export class GuildConfiguration {
    guildId: string;
    messagesImage: string;
    messagesFooterName: string;
    scanMainRegionName: string;
    mainChannelName: string;
    adminChannelName: string;
    emergencyChannelName: string;
    acknowledged: string;
    activityNoticeMinPlayers: number;
}

/* ---------------------------------------------------------------------------------------------------------------
   Last Fetch
   ---------------------------------------------------------------------------------------------------------------*/
export class LastFetch {
    target: string;
    date: string;
}

/* ---------------------------------------------------------------------------------------------------------------
   Online Player
   ---------------------------------------------------------------------------------------------------------------*/
export class OnlinePlayer {
    Time: string;
    Name: string;
    System: string;
    Region: string;
    Ping: number;
}

/* ---------------------------------------------------------------------------------------------------------------
   Watched Faction
   ---------------------------------------------------------------------------------------------------------------*/
export class WatchedFaction {
    guildId: string;
    name: string;
    tags: Array<string>;
    alwaysDisplay: boolean;
}

/* ---------------------------------------------------------------------------------------------------------------
   Watched Player
   ---------------------------------------------------------------------------------------------------------------*/
export class WatchedPlayer {
    guildId: string;
    name: string;
    comment: string;
}

/* ---------------------------------------------------------------------------------------------------------------
   Watched Region
   ---------------------------------------------------------------------------------------------------------------*/
export class WatchedRegion {
    guildId: string;
    name: string;
    systems: Array<string>;
    alwaysDisplay: boolean;
}