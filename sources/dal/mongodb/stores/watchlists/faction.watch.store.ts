import { GenericStore } from './../dal.generic.store';
import { WatchedFaction } from './../../types/watch/watched.faction.type';

export abstract class FactionWatchStore {
    public static storeName = 'factionswatch';

    public static async Set(guildId: string, watchedFactions: Array<WatchedFaction>): Promise<boolean> {
        let result = await GenericStore.clearAndCreateMany(
            FactionWatchStore.storeName,
            { guildId: guildId },
            watchedFactions
        );

        return result;
    }

    public static async GetAll(): Promise<Array<WatchedFaction>> {
        let result = await GenericStore.getAll(FactionWatchStore.storeName) as Array<WatchedFaction>;

        return result;
    }

    public static async Get(guildId: string): Promise<Array<WatchedFaction>> {
        let result = await GenericStore.getBy(
            FactionWatchStore.storeName,
            { guildId: guildId }
        ) as Array<WatchedFaction>;

        return result;
    }

}