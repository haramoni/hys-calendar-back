import { prisma } from "../../../lib/prisma";

type DeleteLogbookInput = {
  id: string;
};

export async function deleteLogbookService({ id }: DeleteLogbookInput) {
  const existingLogbook = await prisma.logbooks.findUnique({
    where: {
      id,
    },
  });

  if (!existingLogbook) {
    throw new Error("Logbook not found");
  }

  await prisma.logbooks.delete({
    where: {
      id,
    },
  });

  return {
    message: "Logbook deleted successfully",
  };
}
