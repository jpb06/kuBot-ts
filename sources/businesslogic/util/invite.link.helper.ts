import { Client } from 'discord.js';

export async function generateInviteLink(
    client: Client
): Promise<string> {
    let link = await client.generateInvite(['ADMINISTRATOR']);
    console.log(link);

    return link;
}