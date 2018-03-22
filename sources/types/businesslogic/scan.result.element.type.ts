import { WatchedPlayer, isWatchedPlayer } from './../dbase/watch/watched.player.type';

export interface ScanResultElement {
    name: string;
    players: WatchedPlayer[];
    count: number;
}

export function isScanResultElement(obj: any): obj is ScanResultElement {
    if (typeof obj.name === "string" &&
        typeof obj.count === "number" &&
        !Array.isArray(obj.players)) {
        return false;
    }

    for (let i = 0; i < obj.players.length; i++) {
        if (!isWatchedPlayer(obj.players[i])) return false;
    }

    return true;
}