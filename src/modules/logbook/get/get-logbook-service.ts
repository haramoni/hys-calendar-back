import { prisma } from "../../../lib/prisma";

export async function getLogbooksService() {
  const logbooks = await prisma.logbooks.findMany({
    include: {
      people: true,
    },
    orderBy: [{ date: "desc" }, { created_at: "desc" }],
  });

  return logbooks.map((logbook) => ({
    id: logbook.id,
    value: logbook.value.toNumber(),
    date: logbook.date,
    reason: logbook.reason,
    personId: logbook.person_id,
    personName: logbook.people.name,
    people: {
      id: logbook.people.id,
      name: logbook.people.name,
    },
    createdAt: logbook.created_at,
    updatedAt: logbook.updated_at,
  }));
}
