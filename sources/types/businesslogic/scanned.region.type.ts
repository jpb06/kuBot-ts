import { WatchedPlayer, isWatchedPlayer } from './../dbase/watch/watched.player.type';

export interface ScannedRegion {
    name: string;
    watchedPlayers: WatchedPlayer[];
    playersCount: number;
}

export function isScannedRegion(obj: any): obj is ScannedRegion {
    if (typeof obj.name !== "string" ||
        typeof obj.playersCount !== "number" ||
        !Array.isArray(obj.watchedPlayers)) {
        return false;
    }

    for (let i = 0; i < obj.watchedPlayers.length; i++) {
        if (!isWatchedPlayer(obj.watchedPlayers[i])) return false;
    }

    return true;
}