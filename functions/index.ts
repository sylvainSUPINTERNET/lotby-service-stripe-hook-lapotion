import { FastifyInstance, FastifyReply, FastifyRequest, FastifyServerOptions } from 'fastify'
import { bot } from '../api/serverless';
const stripe = require('stripe');

import axios from 'axios';

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
interface IQueryString {
    name: string;
}

interface IParams {
    name: string;
}

interface CustomRouteGenericParam {
    Params: IParams
}

interface CustomRouteGenericQuery {
    Querystring: IQueryString
}

export default async function (instance: FastifyInstance, opts: FastifyServerOptions, done:any) {
    
    // Fist create the webhook
    // Make sure it exist then you can work with it ( HTTPS for target url only accepted )
    // https://xabaras.medium.com/setting-your-telegram-bot-webhook-the-easy-way-c7577b2d6f72
    // https://api.telegram.org/bot<token>/setWebhook?url=https://lotby-service-stripe-hook-lapotion.vercel.app/telegram

    // https://telegram-bot-sdk.readme.io/reference/getme
    instance.post("/telegram", async (req,res) => {
        try {
            const { message: { chat: { id }, document } } = (req.body as any);

            const telegramSendImageOptions = {
                url: `${TELEGRAM_API}/sendMessage?chat_id=${id}&${"text=Hello"}`,
                method: "POST",
            }
            
            await axios(telegramSendImageOptions);

            res.status(200).send("OK");

        } catch ( e ) {
            console.error(e);
        }

    })


    // This is parse payload as "raw". required for Stripe, but means if you need JSON you need to JSON.parse before ...
    instance.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) { done(null, body); })

    // this is not using the prefix here !
    instance
    .post("/webhook", async (req: FastifyRequest, res: FastifyReply) => { 
        const signature = req.headers['stripe-signature'];

        // Webhook secret => TODO : move to env and using different dev / prod

        const endpointSecret  = process.env.STRIPE_WEBHOOK_SECRET_TEST;

        // console.log(signature)
        // console.log(endpointSecret)
        // console.log(req.body)

        let event;

        try {
            // Here the req.body is JSON as string ( required by Stripe )
            event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
            console.log(event);
        } catch (err) {
            console.log("Error", err);
            // TODO envoyer un message ici à moi même
            res.status(400).send({
                "error": err
            });
        }


        res.status(200).headers({
            "Content-Type": "application/json"
        }).send({
            "message": "OK"
        });
    });


    instance.register(async (instance: FastifyInstance, opts: FastifyServerOptions, done) => {

        instance.get('/', async (req: FastifyRequest<CustomRouteGenericQuery>, res: FastifyReply) => {
            const { name = '' } = req.query
            res.status(200).send(`Hello ${name}`)
        })

        instance.get('/:name', async (req: FastifyRequest<CustomRouteGenericParam>, res: FastifyReply) => {
            const { name = '' } = req.params
            res.status(200).send(`Hello ${name}`)
        })

        done()
    }, {
        prefix: '/api'
    })

    done()
}