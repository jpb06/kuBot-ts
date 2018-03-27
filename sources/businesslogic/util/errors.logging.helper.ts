import * as moment from 'moment';

import { FilesHelper } from './files.helper';

export abstract class ErrorsLogging {
    public static async Save(
        error: Error
    ): Promise<void> {

        let desc = `\r\n-----------------------------\r\n${moment().format('MM/DD/YYYY HH:mm:ss')}\r\n${error.stack}`;
        await FilesHelper.Append('./err.log', desc);
    }
}