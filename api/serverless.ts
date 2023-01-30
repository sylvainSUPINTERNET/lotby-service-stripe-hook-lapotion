import * as dotenv from "dotenv";
dotenv.config();

// Require the framework
import Fastify, { FastifyReply, FastifyRequest } from "fastify";

import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
const telegramWebhook = bot.createWebhook({ domain: process.env.TELEGRAM_WEBHOOK_DOMAIN! });
// Instantiate Fastify with some config
const app = Fastify({
  logger: false,
});


app.post(bot.secretPathComponent(), async (req,res) => {
     (await telegramWebhook)(req.raw, res.raw)
})

bot.on("message", ctx => ctx.reply("Hello"));


// Register your application as a normal plugin.
app.register(import("../functions/index"), {
    prefix: '/'
});

export default async (req: FastifyRequest<any>, res: FastifyReply) => {
    await app.ready();
    app.server.emit('request', req, res);
}