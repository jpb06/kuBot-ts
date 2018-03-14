export interface ActivityCacheItem {
    name: string;
    playersCount: number;
}

export function isActivityCacheItem(obj: any): obj is ActivityCacheItem {
    return (
        typeof obj.name === "string" &&
        typeof obj.playersCount === "number"
    );
}