﻿import { GenericStore } from './../dal.generic.store';
import { LastFetch } from './../../../../types/dbase/business/last.fetch.type';

export abstract class LastFetchStore {
    public static storeName = 'lastfetch';
    public static target = 'onlineplayers';

    public static async set(value: string): Promise<boolean> {
        let result = await GenericStore.createOrUpdate(
            LastFetchStore.storeName,
            { target: LastFetchStore.target },
            { target: LastFetchStore.target, date: value }
        );

        return result;
    }

    public static async get(): Promise<LastFetch> {
        let result = await GenericStore.getBy(LastFetchStore.storeName, { target: LastFetchStore.target }) as Array<LastFetch>;

        return result[0];
    }

}