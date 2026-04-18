import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { deleteEventService } from "./delete-event-service";

const deleteEventParamsSchema = z.object({
  id: z.string().uuid("Invalid event id"),
});

export async function deleteEventController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id } = deleteEventParamsSchema.parse(request.params);

    const result = await deleteEventService({ id });

    return reply.status(200).send(result);
  } catch (error: any) {
    if (error?.issues) {
      return reply.status(400).send({
        message: "Validation error",
        errors: error.issues,
      });
    }

    if (error?.message === "Event not found") {
      return reply.status(404).send({
        message: error.message,
      });
    }

    return reply.status(500).send({
      message: error?.message || "Internal server error",
    });
  }
}
