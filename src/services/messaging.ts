import { ColorResolvable, Message, MessageEmbed } from "discord.js";

export enum MessageLevel {
    DEFAULT = '#2F3136',
    WARNING = 'RED',
    SUCCESS = 'GREEN',
}

export const replyToMessage = async (message: Message, title: string, level: ColorResolvable = MessageLevel.DEFAULT) => {
    await message.reply({
        'embeds': [
            new MessageEmbed()
                .setAuthor('', "https://cdn.discordapp.com/avatars/878323685272997958/024a3c27376cda14684aa3f84d2e421d.png")
                .setColor(level)
                .setTitle(title)
                // .setDescription(opts.description ?? "")
                // .setURL(opts.url ?? "")
                // .setFields(opts.fields ?? [])
                // .setImage(opts.imageUrl ?? "")
                // .setThumbnail(opts.thumbnailUrl ?? "")
                // .setFooter(opts.footer ?? "")
        ]
    });
}
