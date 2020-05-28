import { Client } from 'discord.js';

import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';
import { GuildConfigurationService } from './../../businesslogic/services/guild.configuration.service';
import { CyclicActivityNotice } from './../tasks/cyclic.activity.notice.task';
//import { generateInviteLink } from './../../businesslogic/util/invite.link.helper';

export abstract class ClientReadyEvent {

    public static async React(
        client: Client
    ): Promise<void> {
        try {
            await client.user?.setActivity('Sirius Sector', { type: 'WATCHING' });

            await GuildConfigurationService.Initialize(client);

            CyclicActivityNotice.Stop();
            await CyclicActivityNotice.Start(client);

            // let link = generateInviteLink(client);

        } catch (err) {
            await ErrorsLogging.Save(err);
        }
    }
}