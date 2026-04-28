import { FastifyInstance } from "fastify";
import { createLogbookController } from "./create/create-logbook-controller";
import { updateLogbookController } from "./update/update-logbook-controller";
import { deleteLogbookController } from "./delete/delete-logbook-controller";
import { getLogbookController } from "./get/get-logbook-controller";

export async function logbookRoutes(app: FastifyInstance) {
  app.post("/logbooks", createLogbookController);
  app.get("/logbooks", getLogbookController);
  app.put("/logbooks/:id", updateLogbookController);
  app.delete("/logbooks/:id", deleteLogbookController);
}
