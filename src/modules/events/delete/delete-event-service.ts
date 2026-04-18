import { prisma } from "../../../lib/prisma";

type DeleteEventInput = {
  id: string;
};

export async function deleteEventService({ id }: DeleteEventInput) {
  const existingEvent = await prisma.stand_events.findUnique({
    where: {
      id,
    },
  });

  if (!existingEvent) {
    throw new Error("Event not found");
  }

  await prisma.stand_events.delete({
    where: {
      id,
    },
  });

  return {
    message: "Event deleted successfully",
  };
}
