import { Message, TextChannel } from 'discord.js';

import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class HelpCommand {
    public static async Send(commandsPrefix: string): Promise<void> {
        try {
            EmbedHelper.SendHelpResponse(commandsPrefix);
        } catch (error) {
            await ErrorsLogging.Save(error);
            EmbedHelper.Error();
        }
    }

    public static async SendAdmin(commandsPrefix: string): Promise<void> {
        try {
            EmbedHelper.SendHelpAdminResponse(commandsPrefix);
        } catch (error) {
            await ErrorsLogging.Save(error);
            EmbedHelper.Error();
        }
    }
}