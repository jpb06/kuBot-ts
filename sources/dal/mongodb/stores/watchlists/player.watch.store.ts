import { GenericStore } from './../dal.generic.store';
import { WatchedPlayer } from './../../types/watch/watched.player.type';

export abstract class PlayerWatchStore {
    public static storeName = 'playerswatch';

    public static async Set(name: string, watchedPlayer: WatchedPlayer): Promise<boolean> {
        let result = await GenericStore.createOrUpdate(
            PlayerWatchStore.storeName,
            { name: name },
            watchedPlayer
        );

        return result;
    }

    public static async GetAll(): Promise<Array<WatchedPlayer>> {
        let result = await GenericStore.getAll(PlayerWatchStore.storeName) as Array<WatchedPlayer>;

        return result;
    }

    public static async Get(guildId: string): Promise<Array<WatchedPlayer>> {
        let result = await GenericStore.getBy(
            PlayerWatchStore.storeName,
            { guildId: guildId }
        ) as Array<WatchedPlayer>;

        return result;
    }

}