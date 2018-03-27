import { Message, TextChannel } from 'discord.js';

import { Guild } from './../../types/dbase/business/guild.type';
import { GuildsStore } from './../../dal/mongodb/stores/business/guilds.store';

import * as GuildConfigInitializer from './../../businesslogic/tasks/guild.config.initializer.task';

import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import * as ErrorsLogging from './../../businesslogic/util/errors.logging.helper';

export async function start(
    message: Message,
    guildsParameters: Guild[]
): Promise<Guild[]> {
    try {
        let persisted = await GuildConfigInitializer.persist(message);
        if (persisted) {
            guildsParameters = await GuildsStore.getAll();
        }

        return guildsParameters;
    } catch (error) {
        await ErrorsLogging.save(error);
        EmbedHelper.Error(message.channel as TextChannel);

        return guildsParameters;
    }
}