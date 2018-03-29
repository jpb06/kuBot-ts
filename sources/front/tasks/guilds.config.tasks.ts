import { Guild, Client, Message, TextChannel } from 'discord.js';

import { GuildConfiguration } from './../../types/dbase/business/guild.configuration.type';
import { GuildsStore } from './../../dal/mongodb/stores/business/guilds.store';

import { MappedGuildConfiguration } from './../../types/businesslogic/mapped.guild.configuration.type';
import { GuildConfigService } from './../../businesslogic/services/guild.config.service';

import { EmbedHelper } from './../../businesslogic/util/embed.helper';
import { ErrorsLogging } from './../../businesslogic/util/errors.logging.helper';

export abstract class GuildConfigTasks {

    public static async InitializeForAllGuilds(
        client: Client
    ): Promise<MappedGuildConfiguration[]> {
        try {
            let guildsParameters = await GuildsStore.getAll();

            let guildsMapping: MappedGuildConfiguration[] = [];

            client.guilds.forEach(async (guild) => {
                let mappedSettings = await GuildConfigService.Initialize(guild, guildsParameters);
                guildsMapping.push(mappedSettings);
            });

            return guildsMapping;
        } catch (error) {
            await ErrorsLogging.Save(error);

            return Promise.reject(error);
        }
    }

    public static async Update(
        message: Message,
        guildsParameters: GuildConfiguration[]
    ): Promise<GuildConfiguration[]> {
        try {
            let persisted = await GuildConfigService.UpdateFromUploadedJson(message);
            if (persisted) {
                guildsParameters = await GuildsStore.getAll();
            }

            return guildsParameters;
        } catch (error) {
            await ErrorsLogging.Save(error);
            EmbedHelper.Error(message.channel as TextChannel);

            return guildsParameters;
        }
    }
}