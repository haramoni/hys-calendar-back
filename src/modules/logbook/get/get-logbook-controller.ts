import { FastifyReply, FastifyRequest } from "fastify";
import { getLogbooksService } from "./get-logbook-service";

export async function getLogbookController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const logbook = await getLogbooksService();

    return reply.status(200).send(logbook);
  } catch (error: any) {
    return reply.status(500).send({
      message: error?.message || "Internal server error",
    });
  }
}
