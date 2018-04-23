import { GenericStore } from './../dal.generic.store';
import { WatchedPlayer } from './../../../../types/persisted.types';

export abstract class PlayerWatchStore {
    public static storeName = 'playerswatch';

    public static async set(
        guildId: string,
        name: string,
        watchedPlayer: WatchedPlayer
    ): Promise<boolean> {
        let result = await GenericStore.createOrUpdate(
            this.storeName,
            { guildId: guildId, name: name },
            watchedPlayer
        );

        return result;
    }

    public static async getAll(): Promise<Array<WatchedPlayer>> {
        let result = await GenericStore.getAll(this.storeName) as Array<WatchedPlayer>;

        return result;
    }

    public static async get(
        guildId: string
    ): Promise<Array<WatchedPlayer>> {
        let result = await GenericStore.getBy(
            this.storeName,
            { guildId: guildId },
            { name: 1 }
        ) as Array<WatchedPlayer>;

        return result;
    }

    public static async remove(
        guildId: string,
        name: string
    ): Promise<boolean> {
        return await GenericStore.remove(
            this.storeName,
            { guildId: guildId, name: name }
        );
    }

}