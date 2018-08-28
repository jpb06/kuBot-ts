import { Client, Message, TextChannel } from 'discord.js';
import * as Dal from 'kubot-dal';

import { ScannedFaction, ScannedRegion } from './../../types/business.types';
import { OnlinePlayersService } from './../../businesslogic/services/online.players.service';

import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';
import { WatchedRegion } from 'kubot-dal/typings/types.export';

export abstract class ScanCommand {
    public static async Process(
        guildId: string
    ): Promise<void> {
        try {
            let onlinePlayers = await OnlinePlayersService.GetList();

            let watchedFactions = await Dal.Manipulation.FactionWatchStore.get(guildId);
            let watchedRegions = await Dal.Manipulation.RegionWatchStore.get(guildId);
            let watchedPlayers = await Dal.Manipulation.PlayerWatchStore.get(guildId);

            let factions = this.GetFactions(watchedFactions, onlinePlayers);
            let regions = this.GetRegions(watchedFactions, watchedRegions, watchedPlayers, onlinePlayers);

            EmbedHelper.SendScanResponse(onlinePlayers.length, factions, regions);
        } catch (error) {
            await ErrorsLogging.Save(error);
            EmbedHelper.Error();
        }
    }

    private static GetFactions(
        watchedFactions: Dal.Types.WatchedFaction[],
        onlinePlayers: Dal.Types.OnlinePlayer[]
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
        watchedFactions: Dal.Types.WatchedFaction[],
        watchedRegions: Dal.Types.WatchedRegion[],
        watchedPlayers: Dal.Types.WatchedPlayer[],
        onlinePlayers: Dal.Types.OnlinePlayer[]
    ): ScannedRegion[] {
        let regions: ScannedRegion[] = [];

        watchedRegions.forEach(region => {

            let regionPlayers = onlinePlayers.filter(player => region.systems.some(system => player.System === system));
            let regionwatchedPlayers: Dal.Types.WatchedPlayer[] = [];

            if (region.showPlayers) {
                
                let regionPlayers = onlinePlayers
                    .filter(player => region.systems.some(system => system === player.System))
                    .map(player => {
                        return {
                            guildId: region.guildId,
                            name: player.Name,
                            comment: ''
                        };
                    })
                    .sort((a, b) => a.name.localeCompare(b.name));

                regionwatchedPlayers.push(...regionPlayers);

            } else {

                watchedFactions.forEach(watchedFaction => {
                    let factionPlayersInRegion: Dal.Types.WatchedPlayer[] = regionPlayers
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

            }

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