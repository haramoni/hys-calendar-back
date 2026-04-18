import { FastifyReply, FastifyRequest } from "fastify";
import { getEventsService } from "./get-events-service";

export async function getEventsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const events = await getEventsService();

    return reply.status(200).send(events);
  } catch (error: any) {
    return reply.status(500).send({
      message: error?.message || "Internal server error",
    });
  }
}
