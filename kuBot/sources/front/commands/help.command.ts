import { Message, TextChannel } from 'discord.js';

import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class HelpCommand {
    public static async Send(): Promise<void> {
        try {
            EmbedHelper.SendHelpResponse();
        } catch (error) {
            await ErrorsLogging.Save(error);
            EmbedHelper.Error();
        }
    }

    public static async SendAdmin(): Promise<void> {
        try {
            EmbedHelper.SendHelpAdminResponse();
        } catch (error) {
            await ErrorsLogging.Save(error);
            EmbedHelper.Error();
        }
    }
}