export abstract class CommandsDescription {

    public static QuoteUsage () {
        return 'Command usage :\n' +
                '```!quote identifier\n' +
                '!q identifier```\n' +
                'Where **__identifier__** is a discord message identifier.\n' +
                'You can get messages identifiers by right clicking on a message and selecting "Copy identifier" (Developer mode must be activated in Discord settings).\n\n' +
                'Example :\n```!quote 420997119868928003\n' +
                '!q 420988491032428545```\n';
    }

    public static QuoteTextUsage () {
    return 'Command usage :\n' +
            '```!quotetext text\n' +
            '!qt text```\n' +
            'Where **__text__** is the text to quote.\n\n' +
            'Example :\n```!quotetext Ima let you finish but...\n' +
            '!qt Let\'s be friends```\n';
    }

    public static EmbedUsage () {
        return 'Command usage :\n' +
                '```!embed "title" "content"\n' +
                '!e "title" "content"```\n' +
                'Where **__title__** is the embed title.\n' +
                'Where **__content__** is the embed content.\n\n' +
                'Example :\n```!embed "Important" "I\'d like to tell you something..."\n' +
                '!e "This is a great title" "This is the greatest announcement ever"```\n';
    }

    public static WatchUsage() {
        return 'Command usage :\n' +
                '```!watch name \'comment\'```\n' +
                'Where :\n' +
                '\t**__name__** is the player ingame name.\n' +
                '\t**__comment__** is a comment related to this player (optional).\n\n' +
                'Example :\n```!watch Innocent.Bystander \'Cardamine smuggler\'\n' +
                '!watch Hayagfgdf.Kimiko \"Mean person\"\n' +
                '!watch Ishikawa.Hideaki```\n';
    }

    public static ShowUsage() {
        return 'Command usage :\n' +
                '```!show term```\n' +
                'Where **__term__** is either :\n' +
                '\tplayers (shorthand p), to display watched players list\n' +
                '\tfactions (shorthand f), to display watched factions list\n' +
                '\tregions (shorthand r), to display watched regions list\n\n' +
                'Example :\n```!show players\n' +
                '!show p\n' +
                '!show factions\n' +
                '!show f\n' +
                '!show regions\n' +
                '!show r```\n';
    }

    public static AdminRemoveUsage() {
        return 'Command usage :\n' +
                '```!remove term value```\n' +
                'Where :\n' +
                '\t**__term__** is either :\n' +
                '\t\tplayer (shorthand p), to specify a player deletion\n' +
                '\t\tfaction (shorthand f), to specify a faction deletion\n\n' +
                '\t**__value__** is a player name or faction identifier.\n\n' +
                'Example :\n```!remove player Mean.Pirate\n' +
                '!remove p Something\n' +
                '!remove faction blooddragons\n' +
                '!remove f libertyrogues```\n';
    }
}