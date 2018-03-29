import { GenericStore } from './../dal.generic.store';
import { GuildConfiguration } from './../../../../types/dbase/business/guild.configuration.type';

export abstract class GuildsStore {
    public static storeName = 'guilds';

    public static async set(
        guildSettings: GuildConfiguration
    ): Promise<boolean> {
        let result = await GenericStore.createOrUpdate(
            this.storeName,
            { guildId: guildSettings.guildId },
            guildSettings
        );

        return result;
    }

    public static async getAll(): Promise<Array<GuildConfiguration>> {
        let result = await GenericStore.getAll(this.storeName) as Array<GuildConfiguration>;

        return result;
    }

    public static async get(
        guildId: string
    ): Promise<GuildConfiguration> {
        let result = await GenericStore.getBy(
            this.storeName,
            { guildId: guildId }) as Array<GuildConfiguration>;

        return result[0];
    }

}