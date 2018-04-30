import { GenericStore } from './../dal.generic.store';
import { WatchedFaction } from './../../../../types/persisted.types';

export abstract class FactionWatchStore {
    public static storeName = 'factionswatch';

    public static async set(
        guildId: string,
        watchedFactions: Array<WatchedFaction>
    ): Promise<boolean> {
        let result = await GenericStore.clearAndCreateMany(
            this.storeName,
            { guildId: guildId },
            watchedFactions
        );

        return result;
    }

    public static async getAll(): Promise<Array<WatchedFaction>> {
        let result = await GenericStore.getAll(this.storeName) as Array<WatchedFaction>;

        return result;
    }

    public static async get(
        guildId: string
    ): Promise<Array<WatchedFaction>> {
        let result = await GenericStore.getBy(
            this.storeName,
            { guildId: guildId },
            { name: 1 }
        ) as Array<WatchedFaction>;

        return result;
    }

}