import { WatchedPlayer } from './../../../kubot-dal/sources/types/persisted.types';

export interface ScannedFaction {
    name: string;
    playersCount: number;
}

export interface ScannedRegion {
    name: string;
    watchedPlayers: WatchedPlayer[];
    playersCount: number;
}