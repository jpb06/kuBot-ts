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
        guildSettings: GuildConfiguration,
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
                    await this.ProcessPlayers(message.guild.id, embedHelper);
                } else if (args === 'factions' || args === 'f') {
                    await this.ProcessFactions(message.guild.id, embedHelper);
                } else if (args === 'regions' || args === 'r') {
                    await this.ProcessRegions(message.guild.id, embedHelper);
                }
            }
        } catch (error) {
            await ErrorsLogging.Save(error);
            EmbedHelper.Error(message.channel as TextChannel);
        }
    }

    private static async ProcessPlayers(
        guildId: string,
        embedHelper: EmbedHelper
    ): Promise<void> {
        let watchedPlayers = await PlayerWatchStore.get(guildId);

        let description = '';
        watchedPlayers.forEach(player => {
            description += '- **' + player.name + '**';
            if (player.comment) description += ' - ' + player.comment;
                description += '\n';
        });

        embedHelper.sendShowResponse(watchedPlayers.length, description, 'Players');
    }

    private static async ProcessFactions(
        guildId: string,
        embedHelper: EmbedHelper
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

        embedHelper.sendShowResponse(watchedFactions.length, description, 'Factions');
    }

    private static async ProcessRegions(
        guildId: string,
        embedHelper: EmbedHelper
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

        embedHelper.sendShowResponse(watchedRegions.length, description, 'Regions');
    }
}