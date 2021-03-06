﻿import * as https from 'https';

import { RequestOptions } from './request.options';

export abstract class DiscoveryGCRequests {
    public static Auth(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            const request = https.request(RequestOptions.AuthRequestOptions(), (response) => {
                if (response.statusCode === 200) {
                    resolve(response.headers["set-cookie"]);
                } else {
                    reject(response.statusCode);
                }
            });
            request.on('error', (error) => reject(error));

            request.write(process.env['discogcAuthPostData']);
            request.end();
        });
    }

    public static async OnlinePlayers(
        cookies: string[]
    ): Promise<string> {
        return new Promise<string>((resolve, reject) => {

            // mybb 1.8.16 update issue is forcing me to forge a request, entirely bypassing authentication
            cookies =[
                'mybb[lastactive]=1531947631;',
                'mybb[lastvisit]=1531939536;',
                'mybbuser=' + process.env['discogcAccountUserId'] + ';',
                'sid=' + process.env['discogcSessionId'] + '; HttpOnly; Secure'
            ];

            const request = https.request(RequestOptions.OnlinePlayersRequestOptions(cookies), (response) => {
                let buffer: any[] = [];

                response.on('data', (chunk) => buffer.push(chunk));
                response.on('end', function () {
                    let body = buffer.join('');

                    // dirty
                    let content = body.substring(body.indexOf('<!-- start: api_playersonline -->'));
                    content = content.substring(content.indexOf('JSON.parse') + 12);
                    content = content.substring(0, content.indexOf('");</script>'));

                    resolve(content);
                });

            });
            request.on('error', (error) => reject(error));

            request.end();
        });
    }
}