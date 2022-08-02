import { CacheType, ChatInputCommandInteraction, Message } from "discord.js";
export interface Command {
    name: string;
    description: string;
    usage: string;
    aliases: string[];
    category: string;
    options?: Option[];
    __internal_requires_directory?: boolean;
    __internal_setdir?(dir: string): void;
    execute: (message: Message, args: string[]) => void;
    interact?: (interaction: ChatInputCommandInteraction<CacheType>) => void;
}



interface Option {
    name: string;
    description: string;
    type: number;
    options?: Option[];
}
