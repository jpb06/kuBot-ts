import { GenericStore } from './../dal.generic.store';
import { WatchedRegion } from './../../../../types/dbase/watch/watched.region.type';

export abstract class RegionWatchStore {
    public static storeName = 'regionswatch';

    public static async set(guildId: string, watchedRegions: Array<WatchedRegion>): Promise<boolean> {
        let result = await GenericStore.clearAndCreateMany(
            RegionWatchStore.storeName,
            { guildId: guildId },
            watchedRegions
        );

        return result;
    }

    public static async getAll(): Promise<Array<WatchedRegion>> {
        let result = await GenericStore.getAll(RegionWatchStore.storeName) as Array<WatchedRegion>;

        return result;
    }

    public static async get(guildId: string): Promise<Array<WatchedRegion>> {
        let result = await GenericStore.getBy(
            RegionWatchStore.storeName,
            { guildId: guildId }
        ) as Array<WatchedRegion>;

        return result;
    }

}