export interface ScannedFaction {
    name: string;
    playersCount: number;
}

export function isScannedFaction(obj: any): obj is ScannedFaction {
    if (typeof obj.name === "string" &&
        typeof obj.playersCount === "number") {
        return true;
    }

    return false;
}