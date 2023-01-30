import * as dotenv from "dotenv";
dotenv.config();

// Require the framework
import Fastify, { FastifyReply, FastifyRequest } from "fastify";


// Instantiate Fastify with some config
const app = Fastify({
  logger: false,
});

import { Telegraf } from "telegraf";
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
const telegramWebhook = bot.createWebhook({ domain: process.env.TELEGRAM_WEBHOOK_DOMAIN! });


// Register your application as a normal plugin.
app.register(import("../functions/index"), {
    prefix: '/'
});


export default async (req: FastifyRequest<any>, res: FastifyReply) => {

  
    bot.on("text", ctx => {    
      console.log("what ?")
      ctx.reply("Hello")
  });
  
    app.post(bot.secretPathComponent(), async (req,res) => {
            (await telegramWebhook)(req.raw, res.raw)
    })

    await app.ready();
    app.server.emit('request', req, res);
}