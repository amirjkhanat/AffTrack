import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        active: data.active,
      },
    });

    return Response.json(user);
  } catch (error) {
    console.error('Failed to update user:', error);
    return Response.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
} 