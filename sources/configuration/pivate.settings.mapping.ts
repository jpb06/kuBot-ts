import { PrivateConfig } from './private.config.local';
import * as Dal from 'kubot-dal';

export abstract class PrivateSettings {

    public static AddToProcess(): void {
        process.env['apiKey'] = PrivateConfig.apiKey;
        process.env['botId'] = PrivateConfig.botId;
        process.env['discogcAuthPostData'] = PrivateConfig.discogcAuthPostData;
        Dal.Configuration.Setup(PrivateConfig.mongodbUrl, PrivateConfig.mongodbBase);
    }
}