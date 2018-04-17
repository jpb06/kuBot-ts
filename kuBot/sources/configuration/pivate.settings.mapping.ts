import { PrivateConfig } from './private.config.local'

export abstract class PrivateSettings {

    public static AddToProcess(): void {
        process.env['apiKey'] = PrivateConfig.apiKey;
        process.env['botId'] = PrivateConfig.botId;
        process.env['discogcAuthPostData'] = PrivateConfig.discogcAuthPostData;
        process.env['mongodbUrl'] = PrivateConfig.mongodbUrl;
        process.env['mongodbBase'] = PrivateConfig.mongodbBase;
    }
}