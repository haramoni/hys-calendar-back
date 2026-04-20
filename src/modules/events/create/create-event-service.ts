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

  if (!sortedDays.length) {
    throw new Error("At least one day is required");
  }

  const daysGroupedByMonth = new Map<
    string,
    {
      year: number;
      month: number;
      days: {
        date: string;
        stage: "MONTAGEM" | "EVENTO" | "DESMONTAGEM" | "EVENTO_COMPLETO";
      }[];
    }
  >();

  for (const day of sortedDays) {
    const parsedDate = new Date(`${day.date}T00:00:00`);
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth() + 1;
    const key = `${year}-${month}`;

    if (!daysGroupedByMonth.has(key)) {
      daysGroupedByMonth.set(key, {
        year,
        month,
        days: [],
      });
    }

    daysGroupedByMonth.get(key)!.days.push(day);
  }

  const createdEvents = [];

  for (const group of daysGroupedByMonth.values()) {
    let calendarMonth = await prisma.calendar_months.findFirst({
      where: {
        year: group.year,
        month: group.month,
      },
    });

    if (!calendarMonth) {
      const startsAt = new Date(group.year, group.month - 1, 1);
      const endsAt = new Date(group.year, group.month, 0);

      calendarMonth = await prisma.calendar_months.create({
        data: {
          year: group.year,
          month: group.month,
          starts_at: startsAt,
          ends_at: endsAt,
        },
      });
    }

    const event = await prisma.stand_events.create({
      data: {
        stand_name: data.standName,
        supplier_name: data.supplierName,
        location: data.location,
        calendar_month_id: calendarMonth.id,
        stand_event_days: {
          create: group.days.map((day) => ({
            date: new Date(`${day.date}T00:00:00`),
            stage: day.stage,
          })),
        },
      },
      include: {
        stand_event_days: true,
      },
    });

    createdEvents.push(event);
  }

  return createdEvents;
}
