import { Client, Message, TextChannel } from 'discord.js';
import * as Dal from 'kubot-dal';

import { ArgumentsValidation } from './../../businesslogic/commands/arguments.validation';
import { CommandsDescription } from './../../businesslogic/commands/commands.description';
import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { StringHelper } from './../../businesslogic/util/string.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export async function Watch(
    args: string[],
    guildId: string,
    commandsPrefix: string
): Promise<void> {
    try {
        let validation = ArgumentsValidation.CheckWatchArgs(args);

        if (validation.errors.length > 0) {
            EmbedHelper.SendValidationError(CommandsDescription.WatchUsage(commandsPrefix), validation.errors);
        } else {
            let watchedFactions = await Dal.Manipulation.FactionWatchStore.get(guildId);
            let playerFactions = watchedFactions.filter(faction => faction.tags.some(tag => validation.args.player.includes(tag)));
            if (playerFactions.length > 0) {
                let playerFactionsDesc = '';
                playerFactions.forEach(faction => {
                    playerFactionsDesc += faction.name + '\n';
                });

            EmbedHelper.SendFactionPlayerWatchError(StringHelper.NegateNonEscapeBackslash(validation.args.player), playerFactionsDesc);
            } else {
                await Dal.Manipulation.PlayerWatchStore.set(guildId, validation.args.player, {
                    guildId: guildId,
                    name: validation.args.player,
                    comment: validation.args.comment
                });

                EmbedHelper.SendWatchResponse(StringHelper.NegateNonEscapeBackslash(validation.args.player));
            }
        }
    } catch (error) {
        await ErrorsLogging.Save(error);
        EmbedHelper.Error();
    }
}