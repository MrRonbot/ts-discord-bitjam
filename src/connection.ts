import { Message } from 'discord.js'
import { 
    entersState, 
    joinVoiceChannel, 
    VoiceConnection, 
    VoiceConnectionStatus 
} 
from "@discordjs/voice";
import { 
    createEmbed, 
    MessagePriority, 
    delay, 
    sendWarning 
} 
from "./utils";

/**
 * Connects to a voice, initialises listeners and subscribes to an existing player.
 * @param player The player to establish a connection for
 * @param message The user's message to infer voice connection details from
 * @returns A {@link VoiceConnection}
 */
 export function initConnection(message: Message) {
    const connection = joinVoiceChannel(
        {
            guildId: message.guildId!,
            channelId: message.member!.voice.channelId!,
            adapterCreator: message.guild!.voiceAdapterCreator
        }
    );

    // Listeners
    connection.on("stateChange", async (oldState, newState) => {
        const newStatus = newState.status

        console.log("Went from " + oldState.status + " to " + newState.status)

        // Connection is established; can start playing
        if (newStatus === VoiceConnectionStatus.Ready) {
            // No users in the vc before connection is established
            if (!message.member!.voice.channel!) {
                const warning = await sendWarning("You left the voice channel before the player could connect!", message.channel);
                await warning.delete().catch();
                return;
            }

            const msg = await message.channel.send(
                { 
                    embeds: [createEmbed({ 
                        author: `Connected to ${message.member!.voice.channel!.name}`, priority: MessagePriority.SUCCESS 
                    })] 
                }
            );
            await delay(10000);
            await msg.delete().catch();
            return;
        }

        // The connection is disrupted. Attempt to reconnect to the voice channel
        else if (newStatus === VoiceConnectionStatus.Disconnected) {
            while (connection.rejoinAttempts < 4) {
                connection.rejoin();

                // Check if it enters the Ready status within 5 seconds
                try {
                    await entersState(connection, VoiceConnectionStatus.Ready, 5000);
                    return;
                } 
                // Otherwise, continue to reconnect until limit is reached
                catch {
                    continue;
                }
            }

            // Most likely unable to reconnect
            destroyConnection(connection);
            await sendWarning("The player could not reconnect to the channel. Try again later?", message.channel);
            return;
        } 

        // Connection to the voice channel is manually destroyed.
        else if (newStatus === VoiceConnectionStatus.Destroyed) {
            const msg = await message.channel.send(
                { 
                    embeds: [createEmbed({ 
                    author: "Disonnected. Bye!", priority: MessagePriority.NOTIF
                })] 
            });
            await delay(10000);
            await msg.delete().catch();
            return;
        }
    });

    connection.on("error", err => {
        console.log(err.message);
        return;
    });

    return connection;
}

export function destroyConnection(connection: VoiceConnection) {
    connection.destroy();
    connection.removeAllListeners();
}