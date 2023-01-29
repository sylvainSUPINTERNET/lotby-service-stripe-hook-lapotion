
import fastify from "fastify";

const server = fastify();

server.

server.get("/users", async (_req, reply): Promise<any> => {
    reply
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({ hello: 'world' })
});

server.listen({port: 3000}, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});