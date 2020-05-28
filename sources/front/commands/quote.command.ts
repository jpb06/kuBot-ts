import { Message } from 'discord.js';

import { ArgumentsValidation } from './../../businesslogic/commands/arguments.validation';
import { CommandsDescription } from './../../businesslogic/commands/commands.description';
import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

interface Acc {
    quote?: any;
    val: Array<string>;
}

export abstract class Quoting {

    public static async ProcessMessage(
        args: string[],
        message: Message,
        commandsPrefix: string
    ): Promise<void> {
        try {
            const errors = ArgumentsValidation.CheckQuoteMessageArgs(args);

            if (errors.length > 0) {
                EmbedHelper.SendValidationError(CommandsDescription.QuoteUsage(commandsPrefix), errors);
            } else {
                if (message.channel.type === 'text') {
                    const matchingMessages = await message.channel.awaitMessages(m => m.id === args[0]);
                    const messageToQuote = matchingMessages.first();
                    if (!messageToQuote || !messageToQuote.author.bot) return;

                    EmbedHelper.SendQuote(message.author.username, messageToQuote.createdAt, messageToQuote.author.username, messageToQuote.content);
                }
            }
        } catch (error) {
            await ErrorsLogging.Save(error);
            EmbedHelper.Error();
        }
    }

    public static async ProcessText(
        text: string,
        authorName: string,
        commandsPrefix: string
    ): Promise<void> {
        try {
            const errors = ArgumentsValidation.CheckQuoteTextArgs(text);

            if (errors.length > 0) {
                EmbedHelper.SendValidationError(CommandsDescription.QuoteTextUsage(commandsPrefix), errors);
            } else {
                EmbedHelper.SendQuoteText(authorName, text);
            }
        } catch (error) {
            await ErrorsLogging.Save(error);
            EmbedHelper.Error();
        }
    }

    public static async ProcessEmbed(
        args: string,
        authorName: string,
        commandsPrefix: string
    ): Promise<void> {
        try {

            const content: string[] = args.split('').reduce((accumulator: Acc, currentValue) => {
                if (currentValue === '"') {
                    accumulator.quote ^= 1;
                } else if (!accumulator.quote && currentValue === ' ') {
                    accumulator.val.push('');
                } else {
                    accumulator.val[accumulator.val.length - 1] += currentValue.replace(/\\(.)/, "$1");
                }
                return accumulator;
            }, {
                val: ['']
            }).val;

            const errors = ArgumentsValidation.CheckEmbedArgs(content);

            if (errors.length > 0) {
                EmbedHelper.SendValidationError(CommandsDescription.EmbedUsage(commandsPrefix), errors);
            } else {
                EmbedHelper.SendEmbed(authorName, content[0], content[1]);
            }
        } catch (error) {
            await ErrorsLogging.Save(error);
            EmbedHelper.Error();
        }
    }
}