import * as dotenv from "dotenv";
dotenv.config();

// Require the framework
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import os from "os";
import axios from "axios";


// Instantiate Fastify with some config
const app = Fastify({
  logger: false,
});

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN!

// Understand webhooks with telegram API : https://strapengine.com/telegram-bot-webhook-tutorial/
// https://www.marclittlemore.com/serverless-telegram-chatbot-vercel/
import { Telegraf } from "telegraf";
export const bot = new Telegraf(telegramBotToken);

console.log("startup")


// Register your application as a normal plugin.
app.register(import("../functions/index"), {
    prefix: '/'
})



export default async (req: FastifyRequest<any>, res: FastifyReply) => {
  console.log("startup")
  // https://www.fastify.io/docs/latest/Reference/Server/
    await app
    // .after( async _err => {
    //   // since vercel free using dynamic hostname for each deployment
    //   try {
    //     console.log("YIKES")
    //     let hostname = os.hostname();
    //     console.log(hostname); // e.g. lapotion-4pxsmbd4s-sylvainsupinternet.vercel.app
    //     await axios.get(`https://api.telegram.org/bot:${telegramBotToken}/setWebhook?url=https://${hostname}/telegram}`) 
    //     await axios.get(`https://api.telegram.org/bot${telegramBotToken}/getWebhookInfo`);
    //   } catch ( err ) {
    //     console.log(err)
    //   }


    //   // https://api.telegram.org/bot<token>/setWebhook?url=lotby-service-stripe-hook-lapotion-4pxsmbd4s-sylvainsupinternet.vercel.app/telegram
      
    // }).ready();
    app.server.emit('request', req, res);
}