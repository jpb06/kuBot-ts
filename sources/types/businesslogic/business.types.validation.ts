import * as BusinessTypes from './business.types';
import * as PersistedTypesValidation from './../dbase/persisted.types.validation';

export function isScannedFaction(obj: any): obj is BusinessTypes.ScannedFaction {
    if (typeof obj.name === "string" &&
        typeof obj.playersCount === "number") {
        return true;
    }

    return false;
}

export function isScannedRegion(obj: any): obj is BusinessTypes.ScannedRegion {
    if (typeof obj.name !== "string" ||
        typeof obj.playersCount !== "number" ||
        !Array.isArray(obj.watchedPlayers)) {
        return false;
    }

    for (let i = 0; i < obj.watchedPlayers.length; i++) {
        if (!PersistedTypesValidation.isWatchedPlayer(obj.watchedPlayers[i])) return false;
    }

    return true;
}