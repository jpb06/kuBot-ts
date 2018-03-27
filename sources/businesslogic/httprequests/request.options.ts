import * as https from 'https';

export abstract class RequestOptions {
    public static AuthRequestOptions(): https.RequestOptions {
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

    public static OnlinePlayersRequestOptions(
        cookies: string[]
    ): https.RequestOptions {
        const requestOptions: https.RequestOptions = {
            hostname: 'discoverygc.com',
            port: 443,
            path: '/forums/api_interface.php?action=players_online',
            method: 'GET',
            headers: {
                'Cookie': this.Stringify(cookies)
            }
        };

        return requestOptions;
    }

    private static Stringify(
        cookies: string[]
    ): string {
        return cookies.map((cookie) => {
            return cookie.substring(0, cookie.indexOf(';'));
        }).join(';');
    }
}