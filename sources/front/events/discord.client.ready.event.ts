import { Client } from 'discord.js';

import { PrivateSettings } from './../../configuration/pivate.settings.mapping';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';
import { GuildConfigurationService } from './../../businesslogic/services/guild.configuration.service';
import { CyclicActivityNotice } from './../tasks/cyclic.activity.notice.task';
//import { generateInviteLink } from './../../businesslogic/util/invite.link.helper';

export abstract class ClientReadyEvent {

    public static async React(
        client: Client
    ): Promise<void> {
        try {
            await PrivateSettings.AddToProcess();

            await client.user.setGame(`Sirius Sector`);

            await GuildConfigurationService.Initialize(client);

            await CyclicActivityNotice.Start();

            // let link = generateInviteLink(client);

        } catch (err) {
            await ErrorsLogging.Save(err);
        }
    }
}