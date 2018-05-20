import { Guild } from 'discord.js';
import * as Dal from 'kubot-dal';

import { GuildConfigurationService } from './../../businesslogic/services/guild.configuration.service';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class GuildDeleteEvent {

    public static async React(
        guild: Guild
    ): Promise<void> {
        try {
            console.log(`Removed from: ${guild.name} (id: ${guild.id})`);

            GuildConfigurationService.remove(guild.id);
        } catch (err) {
            await ErrorsLogging.Save(err);
        }
    }
}