import * as https from 'https';

import { RequestOptions } from './request.options';

export async function send(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        const request = https.request(RequestOptions.AuthRequestOptions(), (response) => {
            if (response.statusCode === 200) {
                resolve(response.headers["set-cookie"]);
            } else {
                reject(response.statusCode);
            }
        });
        request.on('error', (error) => reject(error));

        request.write(process.env.kuBotConfig.discogcAuthPostData);
        request.end();
    });
}