import { Client } from "discord.js";



class Queue {
    elements = {};
    head = 0;
    tail = 0;
    constructor() {
        this.elements = {};
        this.head = 0;
        this.tail = 0;
    }
    enqueue(element) {
        this.elements[this.tail] = element;
        this.tail++;
    }
    dequeue() {
        var element = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        return element;
    }
    peak() {
        return this.elements[this.head];
    }
    get length() {
        return this.tail - this.head;
    }
    get isEmpty() {
        return this.length === 0;
    }
}

//create a map variable to store the queues for each guild

const musicqueues = new Map<string, Queue>();


module.exports = {
    name: "Queue Register",
    description: "Registers queue variables",
    execute: execute
}

function execute(client: Client, token: string, path: string) {
    if (!client.user) return
    client.guilds.cache.forEach(async guild => {
        musicqueues.set(guild.id, new Queue());
    })
}