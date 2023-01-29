import { FastifyInstance, FastifyReply, FastifyRequest, FastifyServerOptions } from 'fastify'

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


    // TODO:  This is "out" of prefix hello this path
    instance.get('/', async (req: FastifyRequest, res: FastifyReply) => {
        console.log("wut")
        res.status(200).send({
            hello: 'World'
        })
    })


    instance.post("/webhook", async (req: FastifyRequest, res: FastifyReply) => { 
        const signature = req.headers['stripe-signature'];
        console.log("WEBHOOK");
        console.log(signature);

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