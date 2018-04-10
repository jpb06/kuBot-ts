import { Message, TextChannel } from 'discord.js';

import { AdminRemove } from './../../front/commands/admin.remove.command';
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
        botUsername: string,
        botAvatarUrl: string
    ): Promise<void> {
        try {
            if (message.author.bot || message.channel.type !== 'text') return; // not replying to others bots; only messages in text channels should be treated

            let guildSettings = GuildConfigurationService.guildsSettings.find(guildSettings => guildSettings.guildId === message.guild.id);
            if (guildSettings === undefined) return;

            if (message.content.startsWith('!')) {
                let messageChunks = message.content.slice(1).trim().split(/ +/g);
                let command = messageChunks[0].toLowerCase();

                let textChannel = <TextChannel>message.channel;
                EmbedHelper.Setup(textChannel, guildSettings, botUsername, botAvatarUrl);

                /* ------------------------------------------------------------------------------------------- 
                Default + Admin */
                if (textChannel.name === guildSettings.mainChannelName || textChannel.name === guildSettings.adminChannelName) {
                    
                    if (command === 'help') { /* help command | !help */
                        await HelpCommand.Send();
                    }
                    if (command === 'scan') { /* scan command | !scan */
                        await ScanCommand.Process(message.guild.id);
                        return;
                    }
                    if (command === 'watch') { /* watch command | !watch <name> <comment> */
                        let args = messageChunks.splice(1);
                        await Watch(args, message.guild.id);
                        return;
                    }
                    if (command === 'show') { /* show command | !show <term> */
                        let args = messageChunks.splice(1).join('');
                        await ShowCommand.Process(args, message.guild.id);
                        return;
                    }
                }

                /* ------------------------------------------------------------------------------------------- 
                Admin */
                if (textChannel.name === guildSettings.adminChannelName) {
                    if (command === 'remove') { /* remove command | !remove <target> <term> */
                        let args = messageChunks.splice(1);
                        await AdminRemove(args, message.guild.id);
                        return;
                    }
                    if (command === 'help') { /* help command | !help */
                        await HelpCommand.SendAdmin();
                        return;
                    }
                }

                /* -------------------------------------------------------------------------------------------
                Every channel */
                if (command === 'quote' || command === 'q') { /* quote command | !quote <identifier> */
                    let args = messageChunks.splice(1);
                    await Quoting.ProcessMessage(args, message);
                    await message.delete();
                    return;
                }
                if (command === 'quotetext' || command === 'qt') { /*  quotetext command | !quotetext '<text>' */
                    let text = messageChunks.splice(1).join(' ');
                    await Quoting.ProcessText(text, message.author.username);
                    await message.delete();
                    return;
                }
                if (command === 'embed' || command === 'e') { /*  embed command | !embed '<title>' '<text>' */
                    let args = messageChunks.splice(1).join(' ');

                    await Quoting.ProcessEmbed(args, message.author.username);
                    await message.delete();
                    return;
                }
            } else if (TextChannel.name === guildSettings.adminChannelName && message.attachments.size === 1) {
                /* Guild config json upload */
                await GuildConfigUpdateRequest.Process(message);
            }

        } catch (error) {
            await ErrorsLogging.Save(error);
        }
    }
}