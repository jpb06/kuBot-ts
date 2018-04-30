import { GenericStore } from './../dal.generic.store';
import { OnlinePlayer } from './../../../../types/persisted.types';

export abstract class OnlinePlayersStore {
    public static storeName = "onlineplayers";

    public static async set(
        onlinePlayers: Array<OnlinePlayer>
    ): Promise<boolean> {
        let result = await GenericStore.clearAllAndCreateMany(this.storeName, onlinePlayers);

        return result;
    }

    public static async getAll(): Promise<Array<OnlinePlayer>> {
        let result = await GenericStore.getAll(this.storeName) as Array<OnlinePlayer>;

        return result;
    }

}