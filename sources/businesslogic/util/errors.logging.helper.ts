import * as moment from 'moment';

import { FilesHelper } from './files.helper';

export abstract class ErrorsLogging {
    public static async Save(
        error: Error
    ): Promise<void> {

        let desc = `\r\n-----------------------------\r\n${moment().format('MM/DD/YYYY HH:mm:ss')}\r\n${error.stack}`;
        await FilesHelper.Append('./err.log', desc);
    }

    public static async SaveGlobal(
        error: Error
    ): Promise<void> {
        let errorData = (error.stack !== undefined) ? error.stack : error.message;
        let desc = `\r\n-----------------------------\r\n${moment().format('MM/DD/YYYY HH:mm:ss')}\r\n${errorData}`;
        await FilesHelper.Append('./err.log', desc);
    }
}