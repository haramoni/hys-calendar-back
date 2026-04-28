import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { deleteLogbookService } from "./delete-logbook-service";

const deleteLogbookParamsSchema = z.object({
  id: z.string().uuid("Invalid logbook id"),
});

export async function deleteLogbookController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id } = deleteLogbookParamsSchema.parse(request.params);

    const result = await deleteLogbookService({ id });

    return reply.status(200).send(result);
  } catch (error: any) {
    if (error?.issues) {
      return reply.status(400).send({
        message: "Validation error",
        errors: error.issues,
      });
    }

    if (error?.message === "Logbook not found") {
      return reply.status(404).send({
        message: error.message,
      });
    }

    return reply.status(500).send({
      message: error?.message || "Internal server error",
    });
  }
}
