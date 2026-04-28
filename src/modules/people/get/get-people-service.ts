import { prisma } from "../../../lib/prisma";

export async function getPeopleService() {
  const people = await prisma.people.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return people.map((person) => ({
    id: person.id,
    name: person.name,
    createdAt: person.created_at,
    updatedAt: person.updated_at,
  }));
}
