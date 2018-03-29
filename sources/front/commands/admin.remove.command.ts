import { Client, Message, TextChannel } from 'discord.js';

import { GuildConfiguration, WatchedFaction } from './../../types/dbase/persisted.types';
import { FactionWatchStore } from './../../dal/mongodb/stores/watchlists/faction.watch.store';
import { PlayerWatchStore } from './../../dal/mongodb/stores/watchlists/player.watch.store';

import { ArgumentsValidation } from './../../businesslogic/commands/arguments.validation';
import { CommandsDescription } from './../../businesslogic/commands/commands.description';
import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export async function AdminRemove(
    guildSettings: GuildConfiguration,
    args: string[],
    message: Message,
    client: Client
): Promise<void> {
    try {
        let embedHelper = new EmbedHelper(message.channel as TextChannel, guildSettings, client.user.username, client.user.avatarURL);
        let validationErrors = ArgumentsValidation.CheckAdminRemoveArgs(args);

        if (validationErrors.length > 0) {
            embedHelper.sendValidationError(CommandsDescription.AdminRemoveUsage(), validationErrors);
        } else {
            let result = false;
            let type = '';
            if (args[0] === 'player' || args[0] === 'p') {
                type = 'Players';
                result = await PlayerWatchStore.remove(message.guild.id, args[1]);
            } 

            if (result) {
                embedHelper.sendRemoveResponse(args[1], type);
            } else {
                embedHelper.sendRemovalFailure(args[1], type);
            }
        }
    } catch (error) {
        await ErrorsLogging.Save(error);
        EmbedHelper.Error(message.channel as TextChannel);
    }
}