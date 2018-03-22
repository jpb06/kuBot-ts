import * as https from 'https';

import { stringify } from './../util/cookies.helper';

export abstract class RequestOptions {
    public static AuthRequestOptions() {
        const requestOptions: https.RequestOptions = {
            hostname: 'discoverygc.com',
            port: 443,
            path: '/forums/member.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': process.env.kuBotConfig.discogcAuthPostData.length
            }
        };

        return requestOptions;
    }

    public static OnlinePlayersRequestOptions(cookies: string[]) {
        const requestOptions: https.RequestOptions = {
            hostname: 'discoverygc.com',
            port: 443,
            path: '/forums/api_interface.php?action=players_online',
            method: 'GET',
            headers: {
                'Cookie': stringify(cookies)
            }
        };

        return requestOptions;
    }
}