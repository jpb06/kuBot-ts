import * as moment from 'moment';
import * as Dal from 'kubot-dal';

import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export async function AdminRequestCredentials(
    guildId: string,
    commandsPrefix: string
): Promise<void> {
    try {
        let now = moment();
        let session = await Dal.Manipulation.SessionStore.get(guildId);
        if (session === null || moment(session.dateGenerated).add(7, 'd').isBefore(now)) {
            let password: string = await Dal.Manipulation.SessionStore.create(guildId);
            EmbedHelper.SendAdminCredentials(guildId, password);
        } else {
            EmbedHelper.SendAdminCredentialsAlreadyCreated(moment(session.dateGenerated).format('MM/DD/YYYY HH:mm'))
        }
    } catch (error) {
        await ErrorsLogging.Save(error);
        EmbedHelper.Error();
    }
}