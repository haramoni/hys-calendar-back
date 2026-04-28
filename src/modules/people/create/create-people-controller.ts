import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { createPeopleService } from "./create-people-service";

const createPeopleBodySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

export async function createPeopleController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const body = createPeopleBodySchema.parse(request.body);

    const person = await createPeopleService(body);

    return reply.status(201).send({
      message: "Person created successfully",
      data: person,
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
