import { FastifyInstance, FastifyReply, FastifyRequest, FastifyServerOptions } from 'fastify'
const stripe = require('stripe');
import { applyCmd, applyCmdError } from '../services/botService';

export const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
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


export interface IMessageFromTelegram {
    update_id: number;
    message: {
        message_id: number;
        from: {
            id: number;
            is_bot: boolean;
            first_name: string;
            last_name: string;
            language_code: string;
        };
        chat: {
            id: number;
            first_name: string;
            last_name: string;
            type: string;
        };
        date: number;
        text: string;
    }
}

export default async function (instance: FastifyInstance, opts: FastifyServerOptions, done:any) {
    
    // Fist create the webhook
    // Make sure it exist then you can work with it ( HTTPS for target url only accepted )
    // https://xabaras.medium.com/setting-your-telegram-bot-webhook-the-easy-way-c7577b2d6f72
    // https://api.telegram.org/bot<token>/setWebhook?url=https://lotby-service-stripe-hook-lapotion.vercel.app/telegram



    // This is parse payload as "raw". required for Stripe, but means if you need JSON you need to JSON.parse before ...
    instance.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) { done(null, body); })


    // https://telegram-bot-sdk.readme.io/reference/getme
    instance.post("/telegram", async (req,res) => {
        try {
            // {"update_id":837341881,"message":{"message_id":24,"from":{"id":5550135310,"is_bot":false,"first_name":"Sylvain","last_name":"Joly","language_code":"fr"},"chat":{"id":5550135310,"first_name":"Sylvain","last_name":"Joly","type":"private"},"date":1675117544,"text":"eza"}}
            // Make sure to JSON.parse since we applied addContentTypeParser for Stripe webhook !
            const message:IMessageFromTelegram = JSON.parse(req.body as string) as IMessageFromTelegram;
            await applyCmd(message);

            res.status(200).send("OK");

        } catch ( e ) {
            console.error(e);
            await applyCmdError(`${e}`);
        }

    })



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