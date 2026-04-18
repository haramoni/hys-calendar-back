import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { createEventService } from "./create-event-service";

const createEventBodySchema = z.object({
  standName: z.string().min(1, "Stand name is required"),
  supplierName: z.string().min(1, "Supplier name is required"),
  location: z.string().min(1, "Location is required"),
  days: z
    .array(
      z.object({
        date: z.string().min(1, "Date is required"),
        stage: z.enum(["MONTAGEM", "EVENTO", "DESMONTAGEM", "EVENTO_COMPLETO"]),
      }),
    )
    .min(1, "At least one day is required"),
});

export async function createEventController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const body = createEventBodySchema.parse(request.body);

    const event = await createEventService(body);

    return reply.status(201).send({
      message: "Event created successfully",
      data: event,
    });
  } catch (error: any) {
    if (error?.issues) {
      return reply.status(400).send({
        message: "Validation error",
        errors: error.issues,
      });
    }

    return reply.status(500).send({
      message: error?.message || "Internal server error",
    });
  }
}
