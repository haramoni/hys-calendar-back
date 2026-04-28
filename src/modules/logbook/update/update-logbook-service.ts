import { prisma } from "../../../lib/prisma";

type UpdateLogbookInput = {
  id: string;
  value: number;
  date: string;
  reason: string;
  personId: string;
};

function formatLogbook(logbook: {
  id: string;
  value: { toNumber(): number };
  date: Date;
  reason: string;
  person_id: string;
  created_at: Date;
  updated_at: Date;
}) {
  return {
    id: logbook.id,
    value: logbook.value.toNumber(),
    date: logbook.date,
    reason: logbook.reason,
    personId: logbook.person_id,
    createdAt: logbook.created_at,
    updatedAt: logbook.updated_at,
  };
}

export async function updateLogbookService(data: UpdateLogbookInput) {
  const existingLogbook = await prisma.logbooks.findUnique({
    where: {
      id: data.id,
    },
  });

  if (!existingLogbook) {
    throw new Error("Logbook not found");
  }

  const person = await prisma.people.findUnique({
    where: {
      id: data.personId,
    },
  });

  if (!person) {
    throw new Error("Person not found");
  }

  const updatedLogbook = await prisma.logbooks.update({
    where: {
      id: data.id,
    },
    data: {
      value: data.value,
      date: new Date(`${data.date}T00:00:00`),
      reason: data.reason.trim(),
      person_id: data.personId,
    },
  });

  return formatLogbook(updatedLogbook);
}
