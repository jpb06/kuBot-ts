﻿import { PrivateConfig } from './private.config.local'

export function initializeSettings() {
    if (!process.env.kuBotConfig) { // case local
        process.env.kuBotConfig.apiKey = PrivateConfig.apiKey;
        process.env.kuBotConfig.botId = PrivateConfig.botId;
        process.env.kuBotConfig.discogcAuthPostData = PrivateConfig.discogcAuthPostData;
        process.env.kuBotConfig.mongodbUrl = PrivateConfig.mongodbUrl;
        process.env.kuBotConfig.mongodbBase = PrivateConfig.mongodbBase;
    } else {
        // case deploy
    }
}