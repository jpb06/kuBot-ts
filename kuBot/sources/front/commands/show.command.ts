import { Client, Message, TextChannel } from 'discord.js';
import { GuildConfiguration } from './../../types/dbase/persisted.types';

import { FactionWatchStore } from './../../dal/mongodb/stores/watchlists/faction.watch.store';
import { PlayerWatchStore } from './../../dal/mongodb/stores/watchlists/player.watch.store';
import { RegionWatchStore } from './../../dal/mongodb/stores/watchlists/region.watch.store';

import { ArgumentsValidation } from './../../businesslogic/commands/arguments.validation';
import { CommandsDescription } from './../../businesslogic/commands/commands.description';
import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class ShowCommand {

    public static async Process(
        args: string,
        guildId: string
    ): Promise<void> {
        try {
            let errors = ArgumentsValidation.CheckShowArgs(args);

            if (errors.length > 0) {
                EmbedHelper.SendValidationError(CommandsDescription.ShowUsage(), errors);
            } else {
                if (args === 'players' || args === 'p') {
                    await this.ProcessPlayers(guildId);
                } else if (args === 'factions' || args === 'f') {
                    await this.ProcessFactions(guildId);
                } else if (args === 'regions' || args === 'r') {
                    await this.ProcessRegions(guildId);
                }
            }
        } catch (error) {
            await ErrorsLogging.Save(error);
            EmbedHelper.Error();
        }
    }

    private static async ProcessPlayers(
        guildId: string
    ): Promise<void> {
        let watchedPlayers = await PlayerWatchStore.get(guildId);

        let description = '';
        watchedPlayers.forEach(player => {
            description += '- **' + player.name + '**';
            if (player.comment) description += ' - ' + player.comment;
                description += '\n';
        });

        EmbedHelper.SendShowResponse(watchedPlayers.length, description, 'Players');
    }

    private static async ProcessFactions(
        guildId: string
    ): Promise<void> {
        let watchedFactions = await FactionWatchStore.get(guildId);

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

        EmbedHelper.SendShowResponse(watchedFactions.length, description, 'Factions');
    }

    private static async ProcessRegions(
        guildId: string
    ): Promise<void> {
        let watchedRegions = await RegionWatchStore.get(guildId);

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

        EmbedHelper.SendShowResponse(watchedRegions.length, description, 'Regions');
    }
}