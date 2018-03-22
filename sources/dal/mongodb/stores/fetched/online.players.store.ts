﻿import { GenericStore } from './../dal.generic.store';
import { OnlinePlayer } from './../../../../types/dbase/external/online.player.type';

export abstract class OnlinePlayersStore {
    public static storeName = "onlineplayers";

    public static async set(onlinePlayers: Array<OnlinePlayer>): Promise<boolean> {
        let result = await GenericStore.clearAllAndCreateMany(OnlinePlayersStore.storeName, onlinePlayers);

        return result;
    }

    public static async getAll(): Promise<Array<OnlinePlayer>> {
        let result = await GenericStore.getAll(OnlinePlayersStore.storeName) as Array<OnlinePlayer>;

        return result;
    }

}