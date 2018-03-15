export interface WatchedPlayer {
    guildId: string,
    name: string,
    comment: string
}

export function isWatchedPlayer(obj: any): obj is WatchedPlayer {
    if (typeof obj.guildId !== "string" ||
        typeof obj.name !== "string" ||
        typeof obj.comment !== "string")
        return false;

    return true;
}