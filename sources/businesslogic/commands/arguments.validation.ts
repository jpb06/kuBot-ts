export abstract class ArgumentsValidation {
    public static CheckQuoteMessageArgs(
        args: string[]
    ): string {
        if (args.length !== 1)
            return 'Expecting one argument\n';

        if (!/^\+?(0|[1-9]\d*)$/.test(args[0]))
            return 'Argument should be a number\n';

        return '';
    }

    public static CheckQuoteTextArgs(
        args: string
    ): string {
        if (args.length === 0)
            return 'Expecting text after the command\n';

        return '';
    }

    public static CheckEmbedArgs(
        args: string[]
    ): string {
        if (args.length !== 2)
            return 'Expecting a title and a message\n';
        if (args[0].length === 0)
            return 'The embed title cannot be empty\n';
        if (args[1].length === 0)
            return 'The embed content cannot be empty\n';

        return '';
    }

    public static CheckWatchArgs(
        args: string[]
    ): { errors: string, args: any } {
        let errors = '';
        let validatedArgs: any = {};

        if (args.length === 0) {
            errors = 'Expecting at least one argument (comments is optional)';
        } else {
            validatedArgs.player = args[0];
            let comments = args.splice(1).join(' ');

            let quotedMatches = comments.match(/^('|"){1}[^]+\1{1}$/g);

            if (!quotedMatches) {
                validatedArgs.comment = null;
            } else if (quotedMatches.length > 1) {
                errors += '\nExpecting only one quoted string as comment\n';
            } else {
                validatedArgs.comment = quotedMatches[0].slice(1, -1);
            }
        }

        return {
            errors: errors,
            args: validatedArgs
        };
    }

    public static CheckShowArgs(
        parameter: string
    ): string {
        let expectedParameter = ['players', 'p', 'factions', 'f', 'regions', 'r'];

        if (!parameter || parameter.length === 0)
            return 'Expecting one argument\n';
        if (!expectedParameter.some(el => el === parameter))
            return 'Illegal parameter\n';

        return '';
    }

    public static CheckAdminRemoveArgs(
        args: string[]
    ): string {
        let expectedFirstParameter = ['player', 'p'];

        if (args.length !== 2)
            return 'Expecting two arguments\n';
        if (!expectedFirstParameter.some(el => el === args[0]))
            return 'Illegal first parameter\n';

        return '';
    }
}