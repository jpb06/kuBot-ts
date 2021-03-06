﻿import { PrivateConfig } from './private.config.local';
import * as Dal from 'kubot-dal';

export abstract class PrivateSettings {

    public static AddToProcess(): void {
        process.env['apiKey'] = PrivateConfig.apiKey;
        process.env['botId'] = PrivateConfig.botId;
        process.env['discogcAuthPostData'] = PrivateConfig.discogcAuthPostData;
        process.env['discogcAccountUserId'] = PrivateConfig.discogcAccountUserId;
        process.env['discogcSessionId'] = PrivateConfig.discogcSessionId;
        Dal.Configuration.Setup({
            srvIPAddress: PrivateConfig.srvIpAddress,
            mongodbPort: PrivateConfig.srvPort,
            mainDb: PrivateConfig.mongodbBase,
            mainDbUsername: PrivateConfig.dbUser,
            mainDbPassword: PrivateConfig.dbPassword
        });
    }
}