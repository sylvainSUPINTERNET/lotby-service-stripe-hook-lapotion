import * as dotenv from "dotenv";
dotenv.config();

// Require the framework
import Fastify, { FastifyReply, FastifyRequest } from "fastify";


// Instantiate Fastify with some config
const app = Fastify({
  logger: false,
});


// Register your application as a normal plugin.
app.register(import("../functions/index"), {
    prefix: '/'
});

export default async (req: FastifyRequest<any>, res: FastifyReply) => {
    await app.ready();
    app.server.emit('request', req, res);
}