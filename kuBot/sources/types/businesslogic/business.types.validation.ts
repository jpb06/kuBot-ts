import * as BusinessTypes from './business.types';
import { PersistedTypesValidation } from './../dbase/persisted.types.validation';

export abstract class BusinessTypesValidation {

    public static IsScannedFaction(obj: any): obj is BusinessTypes.ScannedFaction {
        if (typeof obj.name === "string" &&
            typeof obj.playersCount === "number") {
            return true;
        }

        return false;
    }

    public static IsScannedRegion(obj: any): obj is BusinessTypes.ScannedRegion {
        if (typeof obj.name !== "string" ||
            typeof obj.playersCount !== "number" ||
            !Array.isArray(obj.watchedPlayers)) {
            return false;
        }

        for (let i = 0; i < obj.watchedPlayers.length; i++) {
            if (!PersistedTypesValidation.IsWatchedPlayer(obj.watchedPlayers[i])) return false;
        }

        return true;
    }
}