import { prisma } from "../../../lib/prisma";

type GetEventsByMonthInput = {
  year: number;
  month: number;
};

export async function getEventsByMonthService({
  year,
  month,
}: GetEventsByMonthInput) {
  const calendarMonth = await prisma.calendar_months.findFirst({
    where: {
      year,
      month,
    },
    include: {
      stand_events: {
        include: {
          stand_event_days: {
            orderBy: {
              date: "asc",
            },
          },
        },
        orderBy: {
          created_at: "asc",
        },
      },
    },
  });

  if (!calendarMonth) {
    throw new Error(`Calendar month ${month}/${year} not found`);
  }

  return {
    monthId: calendarMonth.id,
    year: calendarMonth.year,
    month: calendarMonth.month,
    startsAt: calendarMonth.starts_at,
    endsAt: calendarMonth.ends_at,
    events: calendarMonth.stand_events.map((event) => ({
      id: event.id,
      standName: event.stand_name,
      supplierName: event.supplier_name,
      location: event.location,
      createdAt: event.created_at,
      updatedAt: event.updated_at,
      days: event.stand_event_days.map(
        (day: {
          id: string;
          date: Date;
          stage: string;
          created_at: Date;
          updated_at: Date;
        }) => ({
          id: day.id,
          date: day.date,
          stage: day.stage,
          createdAt: day.created_at,
          updatedAt: day.updated_at,
        }),
      ),
    })),
  };
}
