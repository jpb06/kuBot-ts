import { GenericStore } from './../dal.generic.store';
import { WatchedRegion } from './../../../../types/persisted.types';

export abstract class RegionWatchStore {
    public static storeName = 'regionswatch';

    public static async set(
        guildId: string,
        watchedRegions: Array<WatchedRegion>
    ): Promise<boolean> {
        let result = await GenericStore.clearAndCreateMany(
            this.storeName,
            { guildId: guildId },
            watchedRegions
        );

        return result;
    }

    public static async getAll(): Promise<Array<WatchedRegion>> {
        let result = await GenericStore.getAll(this.storeName) as Array<WatchedRegion>;

        return result;
    }

    public static async get(
        guildId: string
    ): Promise<Array<WatchedRegion>> {
        let result = await GenericStore.getBy(
            this.storeName,
            { guildId: guildId },
            { name: 1 }
        ) as Array<WatchedRegion>;

        return result;
    }

}