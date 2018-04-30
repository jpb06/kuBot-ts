import { Client } from 'discord.js';

import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class GlobalErrorEvent {

    public static async React(
        error: Error
    ): Promise<void> {
        await ErrorsLogging.SaveGlobal(error);
    }
}