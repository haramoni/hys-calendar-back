import { FastifyInstance } from "fastify";
import { createPeopleController } from "./create/create-people-controller";
import { getPeopleController } from "./get/get-people-controller";

export async function peopleRoutes(app: FastifyInstance) {
  app.post("/people", createPeopleController);
  app.get("/people", getPeopleController);
}
