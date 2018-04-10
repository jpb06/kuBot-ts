import { GuildChannel } from 'discord.js';
import { WatchedPlayer, GuildConfiguration } from './../dbase/persisted.types';

export interface MappedGuildConfiguration extends GuildConfiguration {
    defaultChannel: GuildChannel;
    emergencyChannel: GuildChannel;
}

export interface ScannedFaction {
    name: string;
    playersCount: number;
}

export interface ScannedRegion {
    name: string;
    watchedPlayers: WatchedPlayer[];
    playersCount: number;
}