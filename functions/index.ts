import { FastifyInstance, FastifyReply, FastifyRequest, FastifyServerOptions } from 'fastify'
import { bot } from '../api/serverless';
const stripe = require('stripe');


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
  

    
    instance.post(bot.secretPathComponent(), async (req,res) => {
        console.log("the fuck");
        res.status(200).send("OK");
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