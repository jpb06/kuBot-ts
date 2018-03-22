import * as moment from 'moment';

import { append } from './files.helper';

export async function save(error) {
    let desc = `\r\n-----------------------------\r\n${moment().format('MM/DD/YYYY HH:mm:ss')}\r\n${error.stack}`;
    await append('./err.log', desc);

    return true;
}