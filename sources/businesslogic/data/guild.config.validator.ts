export abstract class GuildConfigurationValidator {

    /* ---------------------------------------------------------------------------------------------------------------
       Generic
       ---------------------------------------------------------------------------------------------------------------*/
    private static ValidateString(
        name: string,
        value: any
    ) : (string | null) {
        if (!value)
            return name + ' is not defined';
        if (typeof value !== 'string')
            return name + ' is not a string';
        if (value.length === 0)
            return name + ' is empty';

        return null;
    }
    private static ValidateArray(
        name: string,
        value: any
    ): (string | null) {
        if (!value)
            return name + ' is not defined';
        if (!Array.isArray(value))
            return name + ' is not an array';
        if (value.length === 0)
            return name + ' is empty';

        return null;
    }
    private static ValidateNumber(
        name: string,
        value: any
    ): (string | null) {
        if (!value)
            return name + ' is not defined';
        if (typeof value !== 'number')
            return name + ' is not a number';

        return null;
    }
    /* ---------------------------------------------------------------------------------------------------------------
       Objects
       ---------------------------------------------------------------------------------------------------------------*/
    private static VerifyFaction(
        faction: any
    ) : string {
        if (!faction)
            return 'faction is not defined';

        let errors: (string | null)[] = [];
        errors.push(this.ValidateString('name', faction.name));
        errors.push(this.ValidateArray('tags', faction.tags));

        return errors.filter(el => el).join('\n\t');
    }

    private static VerifyRegion(
        region: any
    ) : string {
        if (!region)
            return 'region is not defined';

        let errors: (string | null)[] = [];
        errors.push(this.ValidateString('name', region.name));
        errors.push(this.ValidateArray('systems', region.systems));

        return errors.filter(el => el).join('\n\t');
    }

    private static VerifyGuildSettings(
        guildSettings: any
    ) : string {
        if (!guildSettings)
            return 'guildSettings is not defined';

        let errors: (string | null)[] = [];
        errors.push(this.ValidateString('messagesImage', guildSettings.messagesImage));
        errors.push(this.ValidateString('messagesFooterName', guildSettings.messagesFooterName));
        errors.push(this.ValidateString('scanMainRegionName', guildSettings.scanMainRegionName));
        errors.push(this.ValidateString('acknowledged', guildSettings.acknowledged));
        errors.push(this.ValidateString('mainChannelName', guildSettings.mainChannelName));
        errors.push(this.ValidateString('adminChannelName', guildSettings.adminChannelName));
        errors.push(this.ValidateString('emergencyChannelName', guildSettings.emergencyChannelName));
        errors.push(this.ValidateNumber('activityNoticeMinPlayers', guildSettings.activityNoticeMinPlayers));

        let desc = errors.filter(el => el).join('\n\t');
        if (desc.length > 0) desc = '- **Guild Settings (guildSettings) : **\n\t' + desc;

        return desc;
    }

    /* ---------------------------------------------------------------------------------------------------------------
       JSON documents
       ---------------------------------------------------------------------------------------------------------------*/
    public static VerifyGuildConfig(
        json: any
    ) : string {
        let errors : string[] = [];

        let factionsValidation = this.ValidateArray('factions', json.factions);
        if (factionsValidation) {
            errors.push(factionsValidation);
        } else {
            json.factions.forEach((faction: any, index: number) => {
                let elementValidation = this.VerifyFaction(faction);
                if (elementValidation)
                    errors.push(`- **Faction ${index + 1}**:\n\t` + elementValidation);
            });
        }

        let regionsValidation = this.ValidateArray('regions', json.regions);
        if (regionsValidation) {
            errors.push(regionsValidation);
        } else {
            json.regions.forEach((region: any, index: number) => {
                let elementValidation = this.VerifyRegion(region);
                if (elementValidation)
                    errors.push(`- **Region ${index + 1}**:\n\t` + elementValidation);
            });
        }

        errors.push(this.VerifyGuildSettings(json.guildSettings));

        return errors.filter(el => el).join('\n');
    }
}