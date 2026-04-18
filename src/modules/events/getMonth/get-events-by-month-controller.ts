import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getEventsByMonthService } from "./get-events-by-month-service";

const getEventsByMonthParamsSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
});

export async function getEventsByMonthController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { year, month } = getEventsByMonthParamsSchema.parse(request.params);

    const result = await getEventsByMonthService({ year, month });

    return reply.status(200).send(result);
  } catch (error: any) {
    if (error?.issues) {
      return reply.status(400).send({
        message: "Validation error",
        errors: error.issues,
      });
    }

    if (error?.message?.includes("not found")) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    return reply.status(500).send({
      message: error?.message || "Internal server error",
    });
  }
}
