import { prisma } from "../../../lib/prisma";

type EventStage = "MONTAGEM" | "EVENTO" | "DESMONTAGEM" | "EVENTO_COMPLETO";

type UpdateEventInput = {
  id: string;
  standName: string;
  supplierName: string;
  location: string;
  days: {
    date: string;
    stage: EventStage;
  }[];
};

export async function updateEventService(data: UpdateEventInput) {
  const existingEvent = await prisma.stand_events.findUnique({
    where: {
      id: data.id,
    },
    include: {
      stand_event_days: true,
    },
  });

  if (!existingEvent) {
    throw new Error("Event not found");
  }

  const uniqueDates = new Set(data.days.map((day) => day.date));

  if (uniqueDates.size !== data.days.length) {
    throw new Error("Duplicated dates are not allowed in the same event");
  }

  const sortedDays = [...data.days].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  if (!sortedDays.length) {
    throw new Error("At least one day is required");
  }

  const firstDate = new Date(`${sortedDays[0].date}T00:00:00`);
  const year = firstDate.getFullYear();
  const month = firstDate.getMonth() + 1;

  const calendarMonth = await prisma.calendar_months.findFirst({
    where: {
      year,
      month,
    },
  });

  if (!calendarMonth) {
    throw new Error(`Calendar month not found for ${month}/${year}`);
  }

  const updatedEvent = await prisma.$transaction(async (tx) => {
    await tx.stand_event_days.deleteMany({
      where: {
        stand_event_id: data.id,
      },
    });

    const event = await tx.stand_events.update({
      where: {
        id: data.id,
      },
      data: {
        stand_name: data.standName,
        supplier_name: data.supplierName,
        location: data.location,
        calendar_month_id: calendarMonth.id,
      },
    });

    await tx.stand_event_days.createMany({
      data: sortedDays.map((day) => ({
        date: new Date(`${day.date}T00:00:00`),
        stage: day.stage,
        stand_event_id: data.id,
      })),
    });

    return tx.stand_events.findUnique({
      where: {
        id: event.id,
      },
      include: {
        stand_event_days: {
          orderBy: {
            date: "asc",
          },
        },
      },
    });
  });

  return updatedEvent;
}
