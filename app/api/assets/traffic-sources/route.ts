import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const trafficSource = await prisma.$transaction(async (tx) => {
      const trafficSource = await tx.trafficSource.create({
        data: {
          name: body.name,
          type: body.type,
          description: body.description,
          userId: session.user.id
        }
      });

      await tx.activity.create({
        data: {
          type: "TRAFFIC_SOURCE",
          action: "CREATE",
          userId: session.user.id,
          targetType: "TRAFFIC_SOURCE",
          targetId: trafficSource.id,
          details: `Created traffic source: ${trafficSource.name}`,
          metadata: { ...body }
        }
      });

      return trafficSource;
    });

    return NextResponse.json(trafficSource);
  } catch (error) {
    console.error("[TRAFFIC_SOURCES_POST]", error);
    return new NextResponse(`Failed to create traffic source: ${error.message}`, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const trafficSource = await prisma.$transaction(async (tx) => {
      const trafficSource = await tx.trafficSource.update({
        where: {
          id: body.id,
          userId: session.user.id
        },
        data: {
          name: body.name,
          type: body.type,
          description: body.description
        }
      });

      await tx.activity.create({
        data: {
          type: "TRAFFIC_SOURCE",
          action: "UPDATE",
          userId: session.user.id,
          targetType: "TRAFFIC_SOURCE",
          targetId: trafficSource.id,
          details: `Updated traffic source: ${trafficSource.name}`,
          metadata: { ...body }
        }
      });

      return trafficSource;
    });

    return NextResponse.json(trafficSource);
  } catch (error) {
    console.error("[TRAFFIC_SOURCES_PUT]", error);
    return new NextResponse(`Failed to update traffic source: ${error.message}`, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Missing id parameter", { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      const trafficSource = await tx.trafficSource.delete({
        where: {
          id,
          userId: session.user.id
        }
      });

      await tx.activity.create({
        data: {
          type: "TRAFFIC_SOURCE",
          action: "DELETE",
          userId: session.user.id,
          targetType: "TRAFFIC_SOURCE",
          targetId: id,
          details: `Deleted traffic source: ${trafficSource.name}`,
          metadata: { id }
        }
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[TRAFFIC_SOURCES_DELETE]", error);
    return new NextResponse(`Failed to delete traffic source: ${error.message}`, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const trafficSources = await prisma.trafficSource.findMany({
      where: {
        userId: session.user.id
      }
    });

    return NextResponse.json(trafficSources);
  } catch (error) {
    console.error("[TRAFFIC_SOURCES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 