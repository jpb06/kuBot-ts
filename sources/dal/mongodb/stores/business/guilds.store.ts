import { GenericStore } from './../dal.generic.store';
import { Guild } from './../../../../types/dbase/business/guild.type';

export abstract class GuildsStore {
    public static storeName = 'guilds';

    public static async set(
        guildSettings: Guild
    ): Promise<boolean> {
        let result = await GenericStore.createOrUpdate(
            GuildsStore.storeName,
            { guildId: guildSettings.guildId },
            guildSettings
        );

        return result;
    }

    public static async getAll(): Promise<Array<Guild>> {
        let result = await GenericStore.getAll(GuildsStore.storeName) as Array<Guild>;

        return result;
    }

    public static async get(
        guildId: string
    ): Promise<Guild> {
        let result = await GenericStore.getBy(
            GuildsStore.storeName,
            { guildId: guildId }) as Array<Guild>;

        return result[0];
    }

}