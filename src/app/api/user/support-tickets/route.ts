import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ticketSchema = z.object({
  subject: z.string().trim().min(1).max(200),
  category: z.enum(["account", "payment", "tech", "order", "other"]),
  message: z.string().trim().min(1).max(10000),
});

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
    }

    const tickets = await prisma.supportTickets.findMany({
      where: { UserID: user.id },
      orderBy: { CreatedAt: "desc" },
      take: 50,
      select: {
        TicketID: true,
        Subject: true,
        Category: true,
        Status: true,
        CreatedAt: true,
      },
    });

    return NextResponse.json({
      tickets: tickets.map((ticket) => ({
        id: ticket.TicketID,
        subject: ticket.Subject,
        category: ticket.Category,
        status: ticket.Status,
        createdAt: ticket.CreatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Fetch support tickets error:", error);
    return NextResponse.json(
      { error: "SUPPORT_TICKETS_FAILED" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "AUTH_REQUIRED" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }

    const parsed = ticketSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_TICKET" }, { status: 400 });
    }

    const ticket = await prisma.supportTickets.create({
      data: {
        UserID: user.id,
        Subject: parsed.data.subject,
        Category: parsed.data.category,
        Message: parsed.data.message,
      },
      select: {
        TicketID: true,
        Subject: true,
        Category: true,
        Status: true,
        CreatedAt: true,
      },
    });

    return NextResponse.json(
      {
        ticket: {
          id: ticket.TicketID,
          subject: ticket.Subject,
          category: ticket.Category,
          status: ticket.Status,
          createdAt: ticket.CreatedAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create support ticket error:", error);
    return NextResponse.json(
      { error: "SUPPORT_TICKET_FAILED" },
      { status: 500 },
    );
  }
}
