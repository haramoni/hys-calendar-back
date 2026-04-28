import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { createLogbookService } from "./create-logbook-service";

const createLogbookBodySchema = z.object({
  value: z.coerce.number().positive("Value must be greater than zero"),
  date: z.string().min(1, "Date is required"),
  reason: z.string().trim().min(1, "Reason is required"),
  personId: z.string().uuid("Invalid person id"),
});

export async function createLogbookController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const body = createLogbookBodySchema.parse(request.body);

    const logbook = await createLogbookService(body);

    return reply.status(201).send({
      message: "Logbook created successfully",
      data: logbook,
    });
  } catch (error: any) {
    if (error?.issues) {
      return reply.status(400).send({
        message: "Validation error",
        errors: error.issues,
      });
    }

    if (error?.message === "Person not found") {
      return reply.status(404).send({
        message: error.message,
      });
    }

    return reply.status(500).send({
      message: error?.message || "Internal server error",
    });
  }
}
