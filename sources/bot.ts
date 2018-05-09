import * as Discord from 'discord.js';

import { ClientReadyEvent } from './front/events/discord.client.ready.event';
import { GuildCreateEvent } from './front/events/discord.guild.create.event';
import { GuildDeleteEvent } from './front/events/discord.guild.delete.event';
import { MessageEvent } from './front/events/discord.message.event';
import { GlobalErrorEvent } from './front/events/discord.error.event';

import { PrivateSettings } from './configuration/pivate.settings.mapping';

PrivateSettings.AddToProcess();

const client = new Discord.Client({
    disableEveryone: true
});

client.on('ready', async () => {
    await ClientReadyEvent.React(client);
});
client.on('guildCreate', async (guild) => {
    await GuildCreateEvent.React(guild);
});
client.on('guildDelete', async (guild) => {
    await GuildDeleteEvent.React(guild);
});
client.on('message', async (message) => {
    await MessageEvent.React(message, client.user.username, client.user.avatarURL);
});
client.on('error', async (error) => {
    await GlobalErrorEvent.React(error);
});
client.login(process.env['apiKey']);

