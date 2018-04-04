import { Message, TextChannel } from 'discord.js';
import { GuildConfiguration } from './../../types/dbase/persisted.types';

import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class HelpCommand {
    public static async Send(
        guildSettings: GuildConfiguration,
        message: Message
    ): Promise<void> {
        try {
            let embedHelper = new EmbedHelper(message.channel as TextChannel, guildSettings);

            embedHelper.sendHelpResponse();
        } catch (error) {
            await ErrorsLogging.Save(error);
            EmbedHelper.Error(message.channel as TextChannel);
        }
    }

    public static async SendAdmin(
        guildSettings: GuildConfiguration,
        message: Message
    ): Promise<void> {
        try {
            let embedHelper = new EmbedHelper(message.channel as TextChannel, guildSettings);

            embedHelper.sendHelpAdminResponse();
        } catch (error) {
            await ErrorsLogging.Save(error);
            EmbedHelper.Error(message.channel as TextChannel);
        }
    }
}