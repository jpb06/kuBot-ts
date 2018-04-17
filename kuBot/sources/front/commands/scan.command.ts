import { Client, Message, TextChannel } from 'discord.js';

import { GuildConfiguration, WatchedFaction, WatchedRegion, WatchedPlayer, OnlinePlayer } from './../../types/dbase/persisted.types';
import { ScannedFaction, ScannedRegion } from './../../types/businesslogic/business.types';

import { FactionWatchStore } from './../../dal/mongodb/stores/watchlists/faction.watch.store';
import { RegionWatchStore } from './../../dal/mongodb/stores/watchlists/region.watch.store';
import { PlayerWatchStore } from './../../dal/mongodb/stores/watchlists/player.watch.store';

import { OnlinePlayersService } from './../../businesslogic/services/online.players.service';

import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class ScanCommand {
    public static async Process(
        guildId: string
    ): Promise<void> {
        try {
            let onlinePlayers = await OnlinePlayersService.GetList();

            let watchedFactions = await FactionWatchStore.get(guildId);
            let watchedRegions = await RegionWatchStore.get(guildId);
            let watchedPlayers = await PlayerWatchStore.get(guildId);

            let factions = this.GetFactions(watchedFactions, onlinePlayers);
            let regions = this.GetRegions(watchedFactions, watchedRegions, watchedPlayers, onlinePlayers);

            EmbedHelper.SendScanResponse(onlinePlayers.length, factions, regions);
        } catch (error) {
            await ErrorsLogging.Save(error);
            EmbedHelper.Error();
        }
    }

    private static GetFactions(
        watchedFactions: WatchedFaction[],
        onlinePlayers: OnlinePlayer[]
    ): ScannedFaction[] {
        let factions: ScannedFaction[] = [];

        watchedFactions.forEach(faction => {
            let factionPlayers = onlinePlayers.filter(player => faction.tags.some(tag => player.Name.includes(tag)));

            if (factionPlayers.length > 0 || faction.alwaysDisplay) {
                factions.push({
                    name: faction.name,
                    playersCount: factionPlayers.length
                });
            }
        });

        return factions;
    }

    private static GetRegions(
        watchedFactions: WatchedFaction[],
        watchedRegions: WatchedRegion[],
        watchedPlayers: WatchedPlayer[],
        onlinePlayers: OnlinePlayer[]
    ): ScannedRegion[] {
        let regions: ScannedRegion[] = [];

        watchedRegions.forEach(region => {

            let regionPlayers = onlinePlayers.filter(player => region.systems.some(system => player.System === system));
            let regionwatchedPlayers: WatchedPlayer[] = [];

            watchedFactions.forEach(watchedFaction => {
                let factionPlayersInRegion: WatchedPlayer[] = regionPlayers
                    .filter(player => watchedFaction.tags.some(tag => player.Name.includes(tag)))
                    .map(player => {
                        return {
                            guildId: watchedFaction.guildId,
                            name: player.Name,
                            comment: watchedFaction.name
                        };
                    });

                regionwatchedPlayers.push(...factionPlayersInRegion);
            });

            let regionWatchedPlayers = watchedPlayers.filter(player => regionPlayers.some(regionPlayer => regionPlayer.Name === player.name));

            regionwatchedPlayers.push(...regionWatchedPlayers);

            if (regionPlayers.length > 0 || region.alwaysDisplay) {
                regions.push({
                    name: region.name,
                    watchedPlayers: regionwatchedPlayers,
                    playersCount: regionPlayers.length
                });
            }
        });

        return regions;
    }
}