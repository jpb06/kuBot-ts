import { GenericStore } from './../dal.generic.store';
import { LastFetch } from './../../../../types/persisted.types';

export abstract class LastFetchStore {
    public static storeName = 'lastfetch';
    public static target = 'onlineplayers';

    public static async set(
        value: string
    ): Promise<boolean> {
        let result = await GenericStore.createOrUpdate(
            this.storeName,
            { target: LastFetchStore.target },
            { target: LastFetchStore.target, date: value }
        );

        return result;
    }

    public static async get(): Promise<LastFetch> {
        let result = await GenericStore.getBy(
            this.storeName,
            { target: LastFetchStore.target },
            {}
        ) as Array<LastFetch>;

        return result[0];
    }

}