import { prisma } from "../../../lib/prisma";

export async function getEventsService() {
  const months = await prisma.calendar_months.findMany({
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
    orderBy: [{ year: "asc" }, { month: "asc" }],
  });

  const formatted = months.map((month) => ({
    monthId: month.id,
    year: month.year,
    month: month.month,
    startsAt: month.starts_at,
    endsAt: month.ends_at,
    events: month.stand_events.map((event) => ({
      id: event.id,
      standName: event.stand_name,
      supplierName: event.supplier_name,
      location: event.location,
      createdAt: event.created_at,
      updatedAt: event.updated_at,
      days: event.stand_event_days.map((day) => ({
        id: day.id,
        date: day.date,
        stage: day.stage,
        createdAt: day.created_at,
        updatedAt: day.updated_at,
      })),
    })),
  }));

  return formatted;
}
