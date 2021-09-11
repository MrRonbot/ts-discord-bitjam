import { Client, Message } from "discord.js";
import { replyToMessage, MessageLevel } from "./messaging";

const COMMAND_PING = '>>ping';

export const subscribeBotEvents = (bot: Client) => {
    bot.on('messageCreate', handleMessageCreate);
}

export const handleMessageCreate = async (message: Message) => {
    const pattern = `^${COMMAND_PING}`;
    if (message.content.match(new RegExp(pattern))) {
        await handlePingCommand(message);
    }
}

export const handlePingCommand = async (message: Message) => {
    await replyToMessage(message, 'Pong!', MessageLevel.SUCCESS);
}
