import { FastifyInstance, FastifyReply, FastifyRequest, FastifyServerOptions } from 'fastify'
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


    // this is not using the prefix here !
    instance.post("/webhook", async (req: FastifyRequest, res: FastifyReply) => { 
        const signature = req.headers['stripe-signature'];

        // Webhook secret => TODO : move to env and using different dev / prod

        const endpointSecret  = process.env.STRIPE_WEBHOOK_SECRET_TEST;

        console.log(signature)
        console.log(endpointSecret)
        console.log(req.body)

        let event;

        try {
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