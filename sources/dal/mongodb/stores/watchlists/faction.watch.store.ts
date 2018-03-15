import { GenericStore } from './../dal.generic.store';
import { FactionWatch } from './../../types/watch/faction.watch.type';

export abstract class FactionWatchStore {
    public static storeName = 'factionswatch';

    public static async Set(guildId: string, watchedFactions: Array<FactionWatch>): Promise<boolean> {
        let result = await GenericStore.clearAndCreateMany(
            FactionWatchStore.storeName,
            { guildId: guildId },
            watchedFactions
        );

        return result;
    }

    public static async GetAll(): Promise<Array<FactionWatch>> {
        let result = await GenericStore.getAll(FactionWatchStore.storeName) as Array<FactionWatch>;

        return result;
    }

    public static async Get(guildId: string): Promise<Array<FactionWatch>> {
        let result = await GenericStore.getBy(
            FactionWatchStore.storeName,
            { guildId: guildId }
        ) as Array<FactionWatch>;

        return result;
    }

}