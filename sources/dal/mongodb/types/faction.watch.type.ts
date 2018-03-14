export interface FactionWatch {
    guildId: string,
    identifier: string,
    name: string,
    tags: Array<string>,
    alwaysDisplay: boolean
}

export function isFactionWatch(obj: any): obj is FactionWatch {
    if (typeof obj.guildId !== "string" ||
        typeof obj.identifier !== "string" ||
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