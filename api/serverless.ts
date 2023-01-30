import * as dotenv from "dotenv";
dotenv.config();

// Require the framework
import Fastify, { FastifyReply, FastifyRequest } from "fastify";


// Instantiate Fastify with some config
const app = Fastify({
  logger: false,
});

// Understand webhooks with telegram API : https://strapengine.com/telegram-bot-webhook-tutorial/
import { Telegraf } from "telegraf";
export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);


// Register your application as a normal plugin.
app.register(import("../functions/index"), {
    prefix: '/'
});


export default async (req: FastifyRequest<any>, res: FastifyReply) => {

    await app.ready();
    await bot.createWebhook({ domain: process.env.TELEGRAM_WEBHOOK_DOMAIN!, path:"/telegram" });

    app.server.emit('request', req, res);
}