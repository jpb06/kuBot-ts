import { OnlinePlayer } from './../../types/dbase/external/online.player.type';
import { WatchedFaction } from './../../types/dbase/watch/watched.faction.type';
import { WatchedPlayer } from './../../types/dbase/watch/watched.player.type';

import { ScanResultElement } from './../../types/businesslogic/scan.result.element.type';
import { WatchedElement } from './../../types/businesslogic/watched.element.type';

export function filter (
    onlinePlayers: OnlinePlayer[],
    watchList: WatchedElement[],
    playersFilter: (watch: WatchedElement, player: OnlinePlayer, ) => boolean
): ScanResultElement[] {

    let transformed: ScanResultElement[] = [];
    watchList.forEach(element => {
        
        let players = onlinePlayers
            .filter(player => playersFilter(element, player))
            .map(player => {
                return {
                    guildId: element.guildId,
                    name: player.Name,
                    comment: element.name
                };
            });

        if (element.alwaysDisplay || players.length > 0) {
            transformed.push({ name: element.name, players: players, count: players.length });
        }
    });
    return transformed;
}