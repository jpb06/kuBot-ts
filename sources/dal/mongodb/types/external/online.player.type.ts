export interface OnlinePlayer {
    Time: string;
    Name: number;
    System: number;
    Region: number;
    Ping: number;
}

export function isOnlinePlayer(obj: any): obj is OnlinePlayer {
    return (
        typeof obj.Time === "string" &&
        typeof obj.Name === "string" &&
        typeof obj.System === "string" &&
        typeof obj.Region === "string" &&
        typeof obj.Ping === "number"
    );
}