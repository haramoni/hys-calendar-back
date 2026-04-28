import { FastifyReply, FastifyRequest } from "fastify";
import { getPeopleService } from "./get-people-service";

export async function getPeopleController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const people = await getPeopleService();

    return reply.status(200).send(people);
  } catch (error: any) {
    return reply.status(500).send({
      message: error?.message || "Internal server error",
    });
  }
}
