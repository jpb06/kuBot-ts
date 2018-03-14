import { GenericStore } from './../dal.generic.store';
import { PlayerWatch } from './../../types/player.watch.type';

export abstract class PlayerWatchStore {
    public static storeName = 'playerswatch';

    public static async Set(name: string, watchedPlayer: PlayerWatch): Promise<boolean> {
        let result = await GenericStore.createOrUpdate(
            PlayerWatchStore.storeName,
            { name: name },
            watchedPlayer
        );

        return result;
    }

    public static async GetAll(): Promise<Array<PlayerWatch>> {
        let result = await GenericStore.getAll(PlayerWatchStore.storeName) as Array<PlayerWatch>;

        return result;
    }

    public static async Get(guildId: string): Promise<Array<PlayerWatch>> {
        let result = await GenericStore.getBy(
            PlayerWatchStore.storeName,
            { guildId: guildId }
        ) as Array<PlayerWatch>;

        return result;
    }

}