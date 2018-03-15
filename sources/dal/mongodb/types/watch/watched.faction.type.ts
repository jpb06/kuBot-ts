export interface WatchedFaction {
    guildId: string,
    name: string,
    tags: Array<string>,
    alwaysDisplay: boolean
}

export function isWatchedFaction(obj: any): obj is WatchedFaction {
    if (typeof obj.guildId !== "string" ||
        typeof obj.name !== "string" ||
        typeof obj.alwaysDisplay !== "boolean" ||
        !Array.isArray(obj.tags)) {
        return false;
    }

    for (let i = 0; i < obj.tags.length; i++) {
        if (typeof obj.tags[i] !== "string") return false;
    }

    return true;
}