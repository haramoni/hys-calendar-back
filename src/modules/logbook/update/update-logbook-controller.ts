import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { updateLogbookService } from "./update-logbook-service";

const updateLogbookParamsSchema = z.object({
  id: z.string().uuid("Invalid logbook id"),
});

const updateLogbookBodySchema = z.object({
  value: z.coerce.number().positive("Value must be greater than zero"),
  date: z.string().min(1, "Date is required"),
  reason: z.string().trim().min(1, "Reason is required"),
  personId: z.string().uuid("Invalid person id"),
});

export async function updateLogbookController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id } = updateLogbookParamsSchema.parse(request.params);
    const body = updateLogbookBodySchema.parse(request.body);

    const logbook = await updateLogbookService({
      id,
      ...body,
    });

    return reply.status(200).send({
      message: "Logbook updated successfully",
      data: logbook,
    });
  } catch (error: any) {
    if (error?.issues) {
      return reply.status(400).send({
        message: "Validation error",
        errors: error.issues,
      });
    }

    if (
      error?.message === "Logbook not found" ||
      error?.message === "Person not found"
    ) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    return reply.status(500).send({
      message: error?.message || "Internal server error",
    });
  }
}
