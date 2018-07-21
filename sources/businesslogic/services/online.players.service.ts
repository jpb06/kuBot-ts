import * as moment from 'moment';
import * as Dal from 'kubot-dal';

import { DiscoveryGCRequests } from './../httprequests/discoverygc.requests';

export abstract class OnlinePlayersService {

    public static async GetList(): Promise<Dal.Types.OnlinePlayer[]> {
        let lastFetch = await Dal.Manipulation.LastFetchStore.get();
        let now = moment();

        // request threshold to discogc = 2 minutes 
        if (!lastFetch || moment(lastFetch.date).add(2, 'm').isBefore(now)) {
            //let cookies = await DiscoveryGCRequests.Auth();
            let data = await DiscoveryGCRequests.OnlinePlayers([]);//cookies);

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

            await Dal.Manipulation.OnlinePlayersStore.set(online.Players);
            await Dal.Manipulation.LastFetchStore.set(moment().format());

            return online.Players;
        } else {
            let onlinePlayers = await Dal.Manipulation.OnlinePlayersStore.getAll();
            return onlinePlayers;
        }
    }
}