export interface GuildConfiguration {
    guildId: string;
    messagesImage: string;
    messagesFooterName: string;
    scanMainRegionName: string;
    mainChannel: string;
    adminChannel: string;
    emergencyChannel: string;
    acknowledged: string;
}

export function isGuildConfiguration(obj: any): obj is GuildConfiguration {
    return (
        typeof obj.guildId === "string" &&
        typeof obj.messagesImage === "string" &&
        typeof obj.messagesFooterName === "string" &&
        typeof obj.scanMainRegionName === "string" &&
        typeof obj.mainChannel === "string" &&
        typeof obj.adminChannel === "string" &&
        typeof obj.emergencyChannel === "string" &&
        typeof obj.acknowledged === "string" 
    );
}