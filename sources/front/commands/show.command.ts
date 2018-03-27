import { Client, Message, TextChannel } from 'discord.js';
import { Guild } from './../../types/dbase/business/guild.type';

import { FactionWatchStore } from './../../dal/mongodb/stores/watchlists/faction.watch.store';
import { PlayerWatchStore } from './../../dal/mongodb/stores/watchlists/player.watch.store';
import { RegionWatchStore } from './../../dal/mongodb/stores/watchlists/region.watch.store';

import { WatchedFaction } from './../../types/dbase/watch/watched.faction.type';

import { ArgumentsValidation } from './../../businesslogic/commands/arguments.validation';
import { CommandsDescription } from './../../businesslogic/commands/commands.description';
import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import * as ErrorsLogging from './../../businesslogic/util/errors.logging.helper';

export async function Show(
    guildSettings: Guild,
    args: string,
    message: Message,
    client: Client
): Promise<void> {
    try {
        let embedHelper = new EmbedHelper(message.channel as TextChannel, guildSettings, client.user.username, client.user.avatarURL);
        let errors = ArgumentsValidation.CheckShowArgs(args);

        if (errors.length > 0) {
            embedHelper.sendValidationError(CommandsDescription.ShowUsage(), errors);
        } else {
            if (args === 'players' || args === 'p') {
                let watchedPlayers = await PlayerWatchStore.get(message.guild.id);

                let description = '';
                watchedPlayers
                    .forEach(player => {
                        description += '- **' + player.name + '**';
                        if (player.comment) description += ' - ' + player.comment;
                        description += '\n';
                    });

                embedHelper.sendShowResponse(watchedPlayers.length, description, 'Players');
            } else if (args === 'factions' || args === 'f') {
                let watchedFactions = await FactionWatchStore.get(message.guild.id);

                let description = '';
                watchedFactions
                    .forEach(faction => {
                        description += `- **${faction.name}**\n`;
                        if (faction.alwaysDisplay) description += '\tAlways displayed\n';
                        description += '\tTags: ';

                        faction.tags.forEach(tag => {
                            description += `**${tag}**, `;
                        });
                        description = description.slice(0, -2) + '\n\n';
                    });

                embedHelper.sendShowResponse(watchedFactions.length, description, 'Factions');
            } else if (args === 'regions' || args === 'r') {
                let watchedRegions = await RegionWatchStore.get(message.guild.id);

                let description = '';
                watchedRegions
                    .forEach(region => {
                        description += `- **${region.name}**\n`;
                        if (region.alwaysDisplay) description += '\tAlways displayed\n';
                        description += '\tSystems: ';

                        region.systems.forEach(system => {
                            description += `**${system}**, `;
                        });
                        description = description.slice(0, -2) + '\n\n';
                    });

                embedHelper.sendShowResponse(watchedRegions.length, description, 'Regions');
            }
        }
    } catch (error) {
        await ErrorsLogging.save(error);
        EmbedHelper.Error(message.channel as TextChannel);
    }
}