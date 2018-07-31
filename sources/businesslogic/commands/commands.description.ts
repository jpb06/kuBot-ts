export abstract class CommandsDescription {

    public static QuoteUsage(commandsPrefix: string): string {
        return 'Command usage :\n' +
            '```' + commandsPrefix + 'quote identifier\n' +
            commandsPrefix + 'q identifier```\n' +
            'Where **__identifier__** is a discord message identifier.\n' +
            'You can get messages identifiers by right clicking on a message and selecting "Copy identifier" (Developer mode must be activated in Discord settings).\n\n' +
            'Example :\n```' + commandsPrefix + 'quote 420997119868928003\n' +
            commandsPrefix + 'q 420988491032428545```\n';
    }

    public static QuoteTextUsage(commandsPrefix: string): string {
        return 'Command usage :\n' +
            '```' + commandsPrefix+'quotetext text\n' +
            commandsPrefix+'qt text```\n' +
            'Where **__text__** is the text to quote.\n\n' +
            'Example :\n```' + commandsPrefix +'quotetext Ima let you finish but...\n' +
            commandsPrefix+'qt Let\'s be friends```\n';
    }

    public static EmbedUsage(commandsPrefix: string): string {
        return 'Command usage :\n' +
            '```' + commandsPrefix +'embed "title" "content"\n' +
            commandsPrefix+'e "title" "content"```\n' +
            'Where **__title__** is the embed title.\n' +
            'Where **__content__** is the embed content.\n\n' +
            'Example :\n```' + commandsPrefix +'embed "Important" "I\'d like to tell you something..."\n' +
            commandsPrefix+'e "This is a great title" "This is the greatest announcement ever"```\n';
    }

    public static WatchUsage(commandsPrefix: string): string {
        return 'Command usage :\n' +
            '```' + commandsPrefix +'watch name \'comment\'```\n' +
            'Where :\n' +
            '\t**__name__** is the player ingame name.\n' +
            '\t**__comment__** is a comment related to this player (optional).\n\n' +
            'Example :\n```' + commandsPrefix +'watch Innocent.Bystander \'Cardamine smuggler\'\n' +
            commandsPrefix+'watch Hayagfgdf.Kimiko \"Mean person\"\n' +
            commandsPrefix+'watch Ishikawa.Hideaki```\n';
    }

    public static ShowUsage(commandsPrefix: string): string {
        return 'Command usage :\n' +
            '```' + commandsPrefix +'show term```\n' +
            'Where **__term__** is either :\n' +
            '\tplayers (shorthand p), to display watched players list\n' +
            '\tfactions (shorthand f), to display watched factions list\n' +
            '\tregions (shorthand r), to display watched regions list\n\n' +
            'Example :\n```' + commandsPrefix +'show players\n' +
            commandsPrefix +'show p\n' +
            commandsPrefix +'show factions\n' +
            commandsPrefix +'show f\n' +
            commandsPrefix +'show regions\n' +
            commandsPrefix +'show r```\n';
    }

    public static AdminRemoveUsage(commandsPrefix: string): string {
        return 'Command usage :\n' +
            '```' + commandsPrefix +'remove term value```\n' +
            'Where :\n' +
            '\t**__term__** is either :\n' +
            '\t\tplayer (shorthand p), to specify a player deletion\n' +
            '\t\tfaction (shorthand f), to specify a faction deletion\n\n' +
            '\t**__value__** is a player name or faction identifier.\n\n' +
            'Example :\n```' + commandsPrefix +'remove player Mean.Pirate\n' +
            commandsPrefix +'remove p Something\n' +
            commandsPrefix +'remove faction blooddragons\n' +
            commandsPrefix +'remove f libertyrogues```\n';
    }
}