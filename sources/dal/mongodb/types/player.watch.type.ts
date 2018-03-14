export interface PlayerWatch {
    guildId: string,
    name: string,
    comment: string
}

export function isPlayerWatch(obj: any): obj is PlayerWatch {
    if (typeof obj.guildId !== "string" ||
        typeof obj.name !== "string" ||
        typeof obj.comment !== "string")
        return false;

    return true;
}