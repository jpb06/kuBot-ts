import { Message, TextChannel } from 'discord.js';
import * as fs from 'fs';
import { promisify } from 'util';

import { FilesHelper } from './../../businesslogic/util/files.helper';
import { GuildConfigurationService } from './../../businesslogic/services/guild.configuration.service';

import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class GuildConfigUpdateRequest {

    public static async Process(
        message: Message
    ): Promise<void> {
        try {
            let attachment = message.attachments.first();

            let fileExtension = attachment.filename.substr(attachment.filename.lastIndexOf('.') + 1);
            if (fileExtension === 'json') {
                let channel = <TextChannel>message.channel;
                let tempFilePath = `./dal/guildsconfiguration/${channel.guild.id}_update.json`;

                await FilesHelper.Save(attachment.url, tempFilePath);

                const readFile = promisify(fs.readFile);
                let data = await readFile(tempFilePath, 'utf8');

                let updated = await GuildConfigurationService.UpdateFromJson(channel.guild.id, channel.guild.channels.array(), data.join(''));
                if (updated) {
                    let filePath = `./dal/guildsconfiguration/${channel.guild.id}.json`;
                    await FilesHelper.Remove(filePath);
                    await FilesHelper.Rename(tempFilePath, filePath);

                    EmbedHelper.SendGuildSettingsInitCompleted();
                }
            }
        } catch (error) {
            await ErrorsLogging.Save(error);

            if (error.name === 'Custom') {
                EmbedHelper.SendInvalidGuildConfig(error.message);
            } else {
                EmbedHelper.Error();
            }
        }
    }
}