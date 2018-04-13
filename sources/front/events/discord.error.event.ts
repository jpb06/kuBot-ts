import { Client } from 'discord.js';

import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class ErrorEvent {

    public static async React(
        error: Error
    ): Promise<void> {
        console.log('Error: ', error);
        await ErrorsLogging.Save(error);
    }
}