import { GenericStore } from './../dal.generic.store';
import { RegionWatch } from './../../types/region.watch.type';

export abstract class RegionWatchStore {
    public static storeName = 'factionswatch';

    public static async Set(guildId: string, watchedRegions: Array<RegionWatch>): Promise<boolean> {
        let result = await GenericStore.clearAndCreateMany(
            RegionWatchStore.storeName,
            { guildId: guildId },
            watchedRegions
        );

        return result;
    }

    public static async GetAll(): Promise<Array<RegionWatch>> {
        let result = await GenericStore.getAll(RegionWatchStore.storeName) as Array<RegionWatch>;

        return result;
    }

    public static async Get(guildId: string): Promise<Array<RegionWatch>> {
        let result = await GenericStore.getBy(
            RegionWatchStore.storeName,
            { guildId: guildId }
        ) as Array<RegionWatch>;

        return result;
    }

}