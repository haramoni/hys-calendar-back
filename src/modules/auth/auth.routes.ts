import { FastifyInstance } from "fastify";
import { loginHandler, meHandler } from "./auth.controller";

export async function authRoutes(app: FastifyInstance) {
  app.post("/login", loginHandler);

  app.get(
    "/me",
    {
      preHandler: [(app as any).authenticate],
    },
    meHandler,
  );
}
