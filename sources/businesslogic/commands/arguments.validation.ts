export abstract class ArgumentsValidation {
    public static CheckQuoteMessageArgs (args) {
        if(args.length !== 1)
            return 'Expecting one argument\n';

        if (!/^\+?(0|[1-9]\d*)$/.test(args[0]))
            return 'Argument should be a number\n';

        return '';
    }

    public static CheckQuoteTextArgs (args) {
        if (args.length === 0)
            return 'Expecting text after the command\n';

        return '';
    }

    public static CheckEmbedArgs (args) {
        if (args.length !== 2)
            return 'Expecting a title and a message\n';
        if (args[0].length === 0)
            return 'The embed title cannot be empty\n';
        if (args[1].length === 0)
            return 'The embed content cannot be empty\n';

        return '';
    }
}