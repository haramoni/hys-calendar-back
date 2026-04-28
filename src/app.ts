import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { eventRoutes } from "./modules/events/event-routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { peopleRoutes } from "./modules/people/people-routes";
import { logbookRoutes } from "./modules/logbook/logbook-routes";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(jwt, {
    secret: process.env.JWT_SECRET as string,
  });

  app.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch {
      return reply.status(401).send({
        message: "Unauthorized",
      });
    }
  });

  app.register(authRoutes, { prefix: "/auth" });

  app.get("/health", async () => {
    return { ok: true };
  });

  await app.register(eventRoutes, {
    prefix: "/api",
  });

  await app.register(peopleRoutes, {
    prefix: "/api",
  });

  await app.register(logbookRoutes, {
    prefix: "/api",
  });

  return app;
}
