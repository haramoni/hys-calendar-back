import { prisma } from "../../../lib/prisma";

type CreatePeopleInput = {
  name: string;
};

export async function createPeopleService(data: CreatePeopleInput) {
  const person = await prisma.people.create({
    data: {
      name: data.name.trim(),
    },
  });

  return {
    id: person.id,
    name: person.name,
    createdAt: person.created_at,
    updatedAt: person.updated_at,
  };
}
