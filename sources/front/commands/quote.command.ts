import { Client, Message, TextChannel } from 'discord.js';

import { GuildConfiguration } from './../../types/dbase/persisted.types';
import { ArgumentsValidation } from './../../businesslogic/commands/arguments.validation';
import { CommandsDescription } from './../../businesslogic/commands/commands.description';
import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class Quoting {

    public async processMessage(
        guildSettings: GuildConfiguration,
        args: string[],
        message: Message,
        client: Client
    ): Promise<void> {
        try {
            let embedHelper = new EmbedHelper(message.channel as TextChannel, guildSettings, client.user.username, client.user.avatarURL);
            let errors = ArgumentsValidation.CheckQuoteMessageArgs(args);

            if (errors.length > 0) {
                embedHelper.sendValidationError(CommandsDescription.QuoteUsage(), errors);
            } else {
                if (message.channel.type === 'text') {
                    let messageToQuote = await message.channel.fetchMessage(args[0]);

                    if (!messageToQuote.author.bot) {
                        embedHelper.sendQuote(message.author.username, messageToQuote.createdAt, messageToQuote.author.username, messageToQuote.content);
                    }
                }
            }
        } catch (error) {
            await ErrorsLogging.Save(error);
            EmbedHelper.Error(message.channel as TextChannel);
        }
    }

    public async processText(
        guildSettings: GuildConfiguration,
        text: string,
        message: Message,
        client: Client
    ): Promise<void> {
        try {
            let embedHelper = new EmbedHelper(message.channel as TextChannel, guildSettings, client.user.username, client.user.avatarURL);
            let errors = ArgumentsValidation.CheckQuoteTextArgs(text);

            if (errors.length > 0) {
                embedHelper.sendValidationError(CommandsDescription.QuoteTextUsage(), errors);
            } else {
                embedHelper.sendQuoteText(message.author.username, text);
            }
        } catch (error) {
            await ErrorsLogging.Save(error);
            EmbedHelper.Error(message.channel as TextChannel);
        }
    }

    public async processEmbed(
        guildSettings: GuildConfiguration,
        args,
        message: Message,
        client: Client
    ): Promise<void> {
        try {
            let embedHelper = new EmbedHelper(message.channel as TextChannel, guildSettings, client.user.username, client.user.avatarURL);

            let content: string[] = args.split('').reduce((accumulator, currentValue) => {
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

            let errors = ArgumentsValidation.CheckEmbedArgs(content);

            if (errors.length > 0) {
                embedHelper.sendValidationError(CommandsDescription.EmbedUsage(), errors);
            } else {
                embedHelper.sendEmbed(message.author.username, content[0], content[1]);
            }
        } catch (error) {
            await ErrorsLogging.Save(error);
            EmbedHelper.Error(message.channel as TextChannel);
        }
    }
}