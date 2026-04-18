import { FastifyInstance } from "fastify";
import { createEventController } from "./create/create-event-controller";
import { getEventsController } from "./get/get-events-controller";
import { getEventsByMonthController } from "./getMonth/get-events-by-month-controller";
import { updateEventController } from "./update/update-event-controller";
import { deleteEventController } from "./delete/delete-event-controller";

export async function eventRoutes(app: FastifyInstance) {
  app.post("/events", createEventController);
  app.get("/events", getEventsController);
  app.get("/events/month/:year/:month", getEventsByMonthController);
  app.put("/events/:id", updateEventController);
  app.delete("/events/:id", deleteEventController);
}
