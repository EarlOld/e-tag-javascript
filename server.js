import Fastify from "fastify";
import Etag from "@fastify/etag";
import cors from "@fastify/cors";

const fastify = Fastify({
  logger: true,
});

fastify.register(Etag, { algorithm: "sha1" });
fastify.register(cors, {
  credentials: true,
  origin: true,
  exposedHeaders: "*",
});

let count = 0;

setInterval(() => {
  count++;
}, 3000);

fastify.get("/count", () => {
  return count;
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
