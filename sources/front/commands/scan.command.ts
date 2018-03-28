import { Client, Message, TextChannel } from 'discord.js';
import { Guild } from './../../types/dbase/business/guild.type';

import { FactionWatchStore } from './../../dal/mongodb/stores/watchlists/faction.watch.store';
import { RegionWatchStore } from './../../dal/mongodb/stores/watchlists/region.watch.store';
import { PlayerWatchStore } from './../../dal/mongodb/stores/watchlists/player.watch.store';

import { WatchedFaction } from './../../types/dbase/watch/watched.faction.type';
import { WatchedRegion } from './../../types/dbase/watch/watched.region.type';
import { WatchedPlayer } from './../../types/dbase/watch/watched.player.type';
import { OnlinePlayer } from './../../types/dbase/external/online.player.type';
import { ScannedFaction } from './../../types/businesslogic/scanned.faction.type';
import { ScannedRegion } from './../../types/businesslogic/scanned.region.type';

import * as FetchOnlinePlayersTask from './../../businesslogic/tasks/fetch.online.players.task';

import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class ScanCommand {
    public static async Process(
        guildSettings: Guild,
        message: Message,
        client: Client
    ): Promise<void> {
        try {
            let embedHelper = new EmbedHelper(message.channel as TextChannel, guildSettings);
            let onlinePlayers = await FetchOnlinePlayersTask.start();

            let watchedFactions = await FactionWatchStore.get(message.guild.id);
            let watchedRegions = await RegionWatchStore.get(message.guild.id);
            let watchedPlayers = await PlayerWatchStore.get(message.guild.id);

            let factions = this.GetFactions(watchedFactions, onlinePlayers);
            let regions = this.GetRegions(watchedFactions, watchedRegions, watchedPlayers, onlinePlayers);

            embedHelper.sendScanResponse(onlinePlayers.length, factions, regions);
        } catch (error) {
            await ErrorsLogging.Save(error);
            EmbedHelper.Error(message.channel as TextChannel);
        }
    }

    private static GetFactions(
        watchedFactions: WatchedFaction[],
        onlinePlayers: OnlinePlayer[]
    ): ScannedFaction[] {
        let factions: ScannedFaction[] = [];

        watchedFactions.forEach(faction => {
            let factionPlayers = onlinePlayers.filter(player => faction.tags.some(tag => player.Name.includes(tag)));

            factions.push({
                name: faction.name,
                playersCount: factionPlayers.length
            });
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
                regionwatchedPlayers = onlinePlayers
                    .filter(player => watchedFaction.tags.some(tag => player.Name.includes(tag)))
                    .map(player => {
                        return {
                            guildId: watchedFaction.guildId,
                            name: player.Name,
                            comment: watchedFaction.name
                        }
                    });
            });

            regionwatchedPlayers.push(...watchedPlayers);

            regions.push({
                name: region.name,
                watchedPlayers: regionwatchedPlayers,
                playersCount: regionPlayers.length
            });
        });

        return regions;
    }
}