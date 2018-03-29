import { GuildChannel } from 'discord.js';
import { WatchedPlayer } from './../dbase/persisted.types';

export interface MappedGuildConfiguration {
    id: string,
    defaultChannel: GuildChannel,
    emergencyChannel: GuildChannel
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