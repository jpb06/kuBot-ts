import { Client, Message, TextChannel } from 'discord.js';
import { Guild } from './../../types/dbase/business/guild.type';

import { FactionWatchStore } from './../../dal/mongodb/stores/watchlists/faction.watch.store';
import { PlayerWatchStore } from './../../dal/mongodb/stores/watchlists/player.watch.store';

import { WatchedFaction } from './../../types/dbase/watch/watched.faction.type';

import { ArgumentsValidation } from './../../businesslogic/commands/arguments.validation';
import { CommandsDescription } from './../../businesslogic/commands/commands.description';
import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export async function Watch(
    guildSettings: Guild,
    args: string[],
    message: Message,
    client: Client
): Promise<void> {
    try {
        let embedHelper = new EmbedHelper(message.channel as TextChannel, guildSettings, client.user.username, client.user.avatarURL);
        let validation = ArgumentsValidation.CheckWatchArgs(args);

        if (validation.errors.length > 0) {
            embedHelper.sendValidationError(CommandsDescription.WatchUsage(), validation.errors);
        } else {
            let watchedFactions = await FactionWatchStore.get(message.guild.id);
            let playerFactions = watchedFactions.filter(faction => faction.tags.some(tag => validation.args.player.includes(tag)));
            if (playerFactions.length > 0) {
                let playerFactionsDesc = '';
                playerFactions.forEach(faction => {
                    playerFactionsDesc += faction.name + '\n';
                });

                embedHelper.sendFactionPlayerWatchError(validation.args.player, playerFactionsDesc);
            } else {
                await PlayerWatchStore.set(message.guild.id, {
                    guildId: message.guild.id,
                    name: validation.args.player,
                    comment: validation.args.comment
                });

                embedHelper.sendWatchResponse(validation.args.player);
            }
        }
    } catch (error) {
        await ErrorsLogging.Save(error);
        EmbedHelper.Error(message.channel as TextChannel);
    }
}