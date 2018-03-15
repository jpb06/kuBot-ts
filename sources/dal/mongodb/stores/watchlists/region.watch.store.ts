import { GenericStore } from './../dal.generic.store';
import { WatchedRegion } from './../../types/watch/watched.region.type';

export abstract class RegionWatchStore {
    public static storeName = 'regionswatch';

    public static async Set(guildId: string, watchedRegions: Array<WatchedRegion>): Promise<boolean> {
        let result = await GenericStore.clearAndCreateMany(
            RegionWatchStore.storeName,
            { guildId: guildId },
            watchedRegions
        );

        return result;
    }

    public static async GetAll(): Promise<Array<WatchedRegion>> {
        let result = await GenericStore.getAll(RegionWatchStore.storeName) as Array<WatchedRegion>;

        return result;
    }

    public static async Get(guildId: string): Promise<Array<WatchedRegion>> {
        let result = await GenericStore.getBy(
            RegionWatchStore.storeName,
            { guildId: guildId }
        ) as Array<WatchedRegion>;

        return result;
    }

}