export interface WatchedRegion {
    guildId: string,
    name: string,
    systems: Array<string>,
    alwaysDisplay: boolean
}

export function isWatchedRegion(obj: any): obj is WatchedRegion {
    if (typeof obj.guildId !== "string" ||
        typeof obj.name !== "string" ||
        typeof obj.alwaysDisplay !== "boolean" ||
        !Array.isArray(obj.systems)) {
        return false;
    }

    for (let i = 0; i < obj.systems.length; i++) {
        if (typeof obj.systems[i] !== "string") return false;
    }

    return true;
}