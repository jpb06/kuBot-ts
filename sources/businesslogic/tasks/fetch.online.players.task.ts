import * as moment from 'moment';

import { LastFetchStore } from './../../dal/mongodb/stores/business/last.fetch.store';
import { LastFetch } from './../../types/dbase/business/last.fetch.type';
import { OnlinePlayersStore } from './../../dal/mongodb/stores/fetched/online.players.store';
import { OnlinePlayer } from './../../types/dbase/external/online.player.type';

import { DiscoveryGCRequests } from './../httprequests/discoverygc.requests';

export async function start(): Promise<OnlinePlayer[]> {
    let lastFetch = await LastFetchStore.get();
    let now = moment();

    // request threshold to discogc = 2 minutes 
    if (!lastFetch || moment(lastFetch.date).add(2, 'm').isBefore(now)) {
        let cookies = await DiscoveryGCRequests.Auth();
        let data = await DiscoveryGCRequests.OnlinePlayers(cookies);

        // ??? why escaped quotes
        let cleaned = '';
        let online: any;
        try {
            cleaned = data.replace(/\\"/g, '"')
                .replace(/\\\\\\\\/g, '\\\\')
                .replace(/\\"/g, '\"');
            online = JSON.parse(cleaned);

        } catch (err) {
            console.log(err);
            console.log(cleaned);
        }

        await OnlinePlayersStore.set(online.Players);
        await LastFetchStore.set(moment().format());

        return online.Players;
    } else {
        let onlinePlayers = await OnlinePlayersStore.getAll();
        return onlinePlayers;
    }
}