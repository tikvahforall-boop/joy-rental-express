import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  handleApiError,
  requireAuth,
} from "@/lib/api-utils";
import { messageSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const userId = (session.user as { id: string }).id;
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get("threadId");

    if (threadId) {
      const messages = await prisma.message.findMany({
        where: { threadId },
        include: {
          sender: {
            select: { id: true, name: true, firstName: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: "asc" },
      });
      return successResponse(messages);
    }

    const threads = await prisma.messageThread.findMany({
      where: {
        messages: {
          some: {
            OR: [{ senderId: userId }, { receiverId: userId }],
          },
        },
      },
      include: {
        booking: {
          select: {
            id: true,
            bookingRef: true,
            vehicle: {
              select: { make: true, model: true, year: true },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: {
              select: { id: true, name: true, firstName: true },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return successResponse(threads);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const userId = (session.user as { id: string }).id;
    const body = await request.json();
    const validated = messageSchema.parse(body);

    let threadId = validated.threadId;

    if (!threadId) {
      const thread = await prisma.messageThread.create({
        data: {
          bookingId: validated.bookingId,
        },
      });
      threadId = thread.id;
    }

    const message = await prisma.message.create({
      data: {
        threadId,
        senderId: userId,
        receiverId: validated.receiverId,
        content: validated.content,
      },
      include: {
        sender: {
          select: { id: true, name: true, firstName: true, avatarUrl: true },
        },
      },
    });

    await prisma.messageThread.update({
      where: { id: threadId },
      data: { updatedAt: new Date() },
    });

    return successResponse(message, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
