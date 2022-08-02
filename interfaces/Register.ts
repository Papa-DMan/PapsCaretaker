import { Client } from "discord.js";
export interface Register {
    name: string;
    description: string;
    execute: (client: Client, token: string, path: string) => void;
}
