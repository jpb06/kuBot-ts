/* ---------------------------------------------------------------------------------------------------------------
   Activity Cache
   ---------------------------------------------------------------------------------------------------------------*/
export interface ActivityCacheItem {
    name: string;
    playersCount: number;
}

export interface GuildActivityCache {
    guildId: string;
    lastMessageId: string;
    cache: Array<ActivityCacheItem>;
}

/* ---------------------------------------------------------------------------------------------------------------
   Guild Configuration
   ---------------------------------------------------------------------------------------------------------------*/
export interface GuildConfiguration {
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
export interface LastFetch {
    target: string;
    date: string;
}

/* ---------------------------------------------------------------------------------------------------------------
   Online Player
   ---------------------------------------------------------------------------------------------------------------*/
export interface OnlinePlayer {
    Time: string;
    Name: string;
    System: string;
    Region: string;
    Ping: number;
}

/* ---------------------------------------------------------------------------------------------------------------
   Watched Faction
   ---------------------------------------------------------------------------------------------------------------*/
export interface WatchedFaction {
    guildId: string,
    name: string,
    tags: Array<string>,
    alwaysDisplay: boolean
}

/* ---------------------------------------------------------------------------------------------------------------
   Watched Player
   ---------------------------------------------------------------------------------------------------------------*/
export interface WatchedPlayer {
    guildId: string,
    name: string,
    comment: string
}

/* ---------------------------------------------------------------------------------------------------------------
   Watched Region
   ---------------------------------------------------------------------------------------------------------------*/
export interface WatchedRegion {
    guildId: string,
    name: string,
    systems: Array<string>,
    alwaysDisplay: boolean
}