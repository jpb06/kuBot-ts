import { Message, TextChannel, ClientUser } from 'discord.js';

import { AdminRemove } from './../../front/commands/admin.remove.command';
import { AdminRequestCredentials } from './../../front/commands/admin.request.credentials';
import { HelpCommand } from './../../front/commands/help.command';
import { Quoting } from './../../front/commands/quote.command';
import { ScanCommand } from './../../front/commands/scan.command';
import { ShowCommand } from './../../front/commands/show.command';
import { Watch } from './../../front/commands/watch.command';

import { GuildConfigUpdateRequest } from './../request/guild.config.update.request';

import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { GuildConfigurationService } from './../../businesslogic/services/guild.configuration.service';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class MessageEvent {
    public static async React(
        message: Message,
        user: ClientUser
    ): Promise<void> {
        try {
            // not replying to others bots; only messages in text channels should be treated
            if (message.author.bot || message.channel.type !== 'text' || message.guild === null) return;

            const guildSettings = GuildConfigurationService.guildsSettings.find(guildSettings => guildSettings.guildId === message.guild?.id);
            if (guildSettings === undefined) return;

            const textChannel = message.channel as TextChannel;
            EmbedHelper.Setup(textChannel, guildSettings, user.username, user.avatarURL() as string);

            if (message.content.startsWith(guildSettings.commandsPrefix)) {
                const messageChunks = message.content.slice(guildSettings.commandsPrefix.length).trim().split(/ +/g);
                const command = messageChunks[0].toLowerCase();

                /* ------------------------------------------------------------------------------------------- 
                Default + Admin */
                if (textChannel.name === guildSettings.mainChannelName || textChannel.name === guildSettings.adminChannelName) {

                    if (command === 'help') { /* help command | !help */
                        await HelpCommand.Send(guildSettings.commandsPrefix);
                    }
                    if (command === 'scan') { /* scan command | !scan */
                        await ScanCommand.Process(message.guild.id);
                        return;
                    }
                    if (command === 'watch') { /* watch command | !watch <name> <comment> */
                        const args = messageChunks.splice(1);
                        await Watch(args, message.guild.id, guildSettings.commandsPrefix);
                        return;
                    }
                    if (command === 'show') { /* show command | !show <term> */
                        const args = messageChunks.splice(1).join('');
                        await ShowCommand.Process(args, message.guild.id, guildSettings.commandsPrefix);
                        return;
                    }
                }

                /* ------------------------------------------------------------------------------------------- 
                Admin */
                if (textChannel.name === guildSettings.adminChannelName) {
                    if (command === 'config') {
                        await AdminRequestCredentials(message.guild.id, guildSettings.commandsPrefix);
                        return;
                    }
                    if (command === 'remove') { /* remove command | !remove <target> <term> */
                        const args = messageChunks.splice(1);
                        await AdminRemove(args, message.guild.id, guildSettings.commandsPrefix);
                        return;
                    }
                    if (command === 'help') { /* help command | !help */
                        await HelpCommand.SendAdmin(guildSettings.commandsPrefix);
                        return;
                    }
                }

                /* -------------------------------------------------------------------------------------------
                Every channel */
                if (command === 'quote' || command === 'q') { /* quote command | !quote <identifier> */
                    const args = messageChunks.splice(1);
                    await Quoting.ProcessMessage(args, message, guildSettings.commandsPrefix);
                    await message.delete();
                    return;
                }
                if (command === 'quotetext' || command === 'qt') { /*  quotetext command | !quotetext '<text>' */
                    const text = messageChunks.splice(1).join(' ');
                    await Quoting.ProcessText(text, message.author.username, guildSettings.commandsPrefix);
                    await message.delete();
                    return;
                }
                if (command === 'embed' || command === 'e') { /*  embed command | !embed '<title>' '<text>' */
                    const args = messageChunks.splice(1).join(' ');

                    await Quoting.ProcessEmbed(args, message.author.username, guildSettings.commandsPrefix);
                    await message.delete();
                    return;
                }
            } else if (textChannel.name === guildSettings.adminChannelName && message.attachments.size === 1) {
                /* Guild config json upload */
                await GuildConfigUpdateRequest.Process(message);
            }

        } catch (error) {
            await ErrorsLogging.Save(error);
        }
    }
}