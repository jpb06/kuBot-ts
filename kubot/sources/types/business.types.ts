import * as Dal from 'kubot-dal';

export interface ScannedFaction {
    name: string;
    playersCount: number;
}

export interface ScannedRegion {
    name: string;
    watchedPlayers: Dal.Types.WatchedPlayer[];
    playersCount: number;
}