import { prisma } from "../../../lib/prisma";

type CreateEventInput = {
  standName: string;
  supplierName: string;
  location: string;
  days: {
    date: string;
    stage: "MONTAGEM" | "EVENTO" | "DESMONTAGEM" | "EVENTO_COMPLETO";
  }[];
};

export async function createEventService(data: CreateEventInput) {
  const sortedDays = [...data.days].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const firstDay = sortedDays[0];

  if (!firstDay) {
    throw new Error("At least one day is required");
  }

  const firstDate = new Date(`${firstDay.date}T00:00:00`);
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

  const event = await prisma.stand_events.create({
    data: {
      stand_name: data.standName,
      supplier_name: data.supplierName,
      location: data.location,
      calendar_month_id: calendarMonth.id,
      stand_event_days: {
        create: sortedDays.map((day) => ({
          date: new Date(`${day.date}T00:00:00`),
          stage: day.stage,
        })),
      },
    },
    include: {
      stand_event_days: true,
    },
  });

  return event;
}
