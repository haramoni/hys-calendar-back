import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { updateEventService } from "./update-event-service";

const updateEventParamsSchema = z.object({
  id: z.string().uuid("Invalid event id"),
});

const updateEventBodySchema = z.object({
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

export async function updateEventController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id } = updateEventParamsSchema.parse(request.params);
    const body = updateEventBodySchema.parse(request.body);

    const event = await updateEventService({
      id,
      ...body,
    });

    return reply.status(200).send({
      message: "Event updated successfully",
      data: event,
    });
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
