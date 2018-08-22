import { Client, Message, TextChannel } from 'discord.js';

import * as Dal from 'kubot-dal';

import { ArgumentsValidation } from './../../businesslogic/commands/arguments.validation';
import { CommandsDescription } from './../../businesslogic/commands/commands.description';
import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { StringHelper } from './../../businesslogic/util/string.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export async function AdminRemove(
    args: string[],
    guildId: string,
    commandsPrefix: string
): Promise<void> {
    try {
        let validationErrors = ArgumentsValidation.CheckAdminRemoveArgs(args);

        if (validationErrors.length > 0) {
            EmbedHelper.SendValidationError(CommandsDescription.AdminRemoveUsage(commandsPrefix), validationErrors);
        } else {
            let result = false;
            let type = '';
            if (args[0] === 'player' || args[0] === 'p') {
                type = 'Players';
                result = await Dal.Manipulation.PlayerWatchStore.remove(guildId, args[1]);
                args[1] = StringHelper.NegateNonEscapeBackslash(args[1]);
            } 

            if (result) {
                EmbedHelper.SendRemoveResponse(args[1], type);
            } else {
                EmbedHelper.SendRemovalFailure(args[1], type);
            }
        }
    } catch (error) {
        await ErrorsLogging.Save(error);
        EmbedHelper.Error();
    }
}