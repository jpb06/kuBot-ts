import { Message, TextChannel } from 'discord.js';
import * as fs from 'fs-extra';
import * as moment from 'moment';

import { FilesHelper } from './../../businesslogic/util/files.helper';
import { GuildConfigurationService } from './../../businesslogic/services/guild.configuration.service';

import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class GuildConfigUpdateRequest {

    public static async Process(
        message: Message
    ): Promise<void> {
        try {
            const attachment = message.attachments.first();
            if (!attachment || !attachment.name) return;

            const fileExtension = attachment.name.substr(attachment.name.lastIndexOf('.') + 1);
            if (fileExtension === 'json') {
                const now = moment().format('DDMMYYYY-HHmmss');
                const folder = './guildsConfiguration';
                const channel = message.channel as TextChannel;
                const tempFilePath = `${folder}/${channel.guild.id}_${now}.json`;

                await FilesHelper.Save(attachment.url, tempFilePath);

                const data = (await fs.readFile(tempFilePath, 'utf8')).toString();

                const updated = await GuildConfigurationService.UpdateFromJson(channel.guild.id, channel.guild.channels.cache.array(), data);
                if (updated) {
                    await FilesHelper.Rename(tempFilePath, `${folder}/${channel.guild.id}_${now}_pass.json`);
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