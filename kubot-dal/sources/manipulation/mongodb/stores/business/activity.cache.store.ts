import { GenericStore } from './../dal.generic.store';
import { GuildActivityCache } from './../../../../types/persisted.types';

export abstract class ActivityCacheStore {
    public static storeName = 'activitystatuscache';

    public static async set(
        cache: Array<GuildActivityCache>
    ): Promise<boolean> {
        let result = await GenericStore.clearAllAndCreateMany(this.storeName, cache);

        return result;
    }

    public static async getAll(): Promise<Array<GuildActivityCache>> {
        let result = await GenericStore.getAll(this.storeName) as Array<GuildActivityCache>;

        return result;
    }

    public static async get(
        guildId: string
    ): Promise<GuildActivityCache> {
        let result = await GenericStore.getBy(
            this.storeName,
            { guildId: guildId },
            {}
        ) as Array<GuildActivityCache>;

        return result[0];
    }

}