export interface RegionWatch {
    guildId: string,
    identifier: string,
    name: string,
    systems: Array<string>,
    alwaysDisplay: boolean
}

export function isRegionWatch(obj: any): obj is RegionWatch {
    if (typeof obj.guildId !== "string" ||
        typeof obj.identifier !== "string" ||
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