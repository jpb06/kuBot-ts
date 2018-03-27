import { Client, Message, TextChannel } from 'discord.js';
import { Guild } from './../../types/dbase/business/guild.type';

import { FactionWatchStore } from './../../dal/mongodb/stores/watchlists/faction.watch.store';
import { RegionWatchStore } from './../../dal/mongodb/stores/watchlists/region.watch.store';
import { PlayerWatchStore } from './../../dal/mongodb/stores/watchlists/player.watch.store';

import { WatchedFaction } from './../../types/dbase/watch/watched.faction.type';
import { WatchedRegion } from './../../types/dbase/watch/watched.region.type';
import { OnlinePlayer } from './../../types/dbase/external/online.player.type';

import * as FetchOnlinePlayersTask from './../../businesslogic/tasks/fetch.online.players.task';
import * as WatchTransformTask from './../../businesslogic/tasks/watch.transform.task';

import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export async function Scan(
    guildSettings: Guild,
    message: Message,
    client: Client
): Promise<void> {
    try {
        let embedHelper = new EmbedHelper(message.channel as TextChannel, guildSettings);
        let onlinePlayers = await FetchOnlinePlayersTask.start();

        let watchedFactions = await FactionWatchStore.get(message.guild.id);
        let factions = WatchTransformTask.filter(onlinePlayers, watchedFactions, (watch : WatchedFaction, player : OnlinePlayer) => {
            return watch.tags.some(tag => player.Name.includes(tag));
        });

        let watchedRegions = await RegionWatchStore.get(message.guild.id);
        let regions = WatchTransformTask.filter(onlinePlayers, watchedRegions, (watch: WatchedRegion, player: OnlinePlayer) => {
            return watch.systems.some(system => player.System === system);
        });

        let watchedPlayers = await PlayerWatchStore.get(message.guild.id);

        regions.forEach(region => {
            let localPlayersWatch = watchedPlayers.filter(watchedPlayer => region.players.some(localPlayer => localPlayer.name === watchedPlayer.name));

            watchedFactions.forEach(faction => {
                let factionPlayers = region.players.filter(localPlayer => faction.tags.some(tag => localPlayer.name.includes(tag)));                
                localPlayersWatch.push(...factionPlayers);
            });

            region.players = localPlayersWatch;
        });
        
        embedHelper.sendScanResponse(onlinePlayers.length, factions, regions);
    } catch (error) {
        await ErrorsLogging.Save(error);
        EmbedHelper.Error(message.channel as TextChannel);
    }
}