import { GuildChannel } from 'discord.js';

export interface MappedGuildConfiguration {
    id: string,
    defaultChannel: GuildChannel,
    emergencyChannel: GuildChannel
}