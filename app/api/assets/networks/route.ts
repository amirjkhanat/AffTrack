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
    const network = await prisma.$transaction(async (tx) => {
      const network = await tx.affiliateNetwork.create({
        data: {
          name: body.name,
          website: body.website,
          loginUrl: body.loginUrl,
          username: body.username,
          password: body.password,
          userId: session.user.id
        }
      });

      await tx.activity.create({
        data: {
          type: "TRAFFIC_SOURCE",
          action: "CREATE",
          userId: session.user.id,
          details: `Created affiliate network: ${network.name}`,
          targetType: "NETWORK",
          targetId: network.id
        }
      });

      return network;
    });

    return NextResponse.json(network);
  } catch (error) {
    console.error("[NETWORKS_POST]", error);
    return new NextResponse(`Failed to create network: ${error.message}`, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const network = await prisma.$transaction(async (tx) => {
      const network = await tx.affiliateNetwork.update({
        where: {
          id: body.id,
          userId: session.user.id
        },
        data: {
          name: body.name,
          website: body.website,
          loginUrl: body.loginUrl,
          username: body.username,
          password: body.password
        }
      });

      await tx.activity.create({
        data: {
          type: "NETWORK",
          action: "UPDATE",
          userId: session.user.id,
          details: `Updated affiliate network: ${network.name}`,
          targetType: "NETWORK",
          targetId: network.id
        }
      });

      return network;
    });

    return NextResponse.json(network);
  } catch (error) {
    console.error("[NETWORKS_PUT]", error);
    return new NextResponse(`Failed to update network: ${error.message}`, { status: 500 });
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
      const network = await tx.affiliateNetwork.delete({
        where: {
          id,
          userId: session.user.id
        }
      });

      await tx.activity.create({
        data: {
          type: "NETWORK",
          action: "DELETE",
          userId: session.user.id,
          details: `Deleted affiliate network: ${network.name}`,
          targetType: "NETWORK",
          targetId: network.id
        }
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[NETWORKS_DELETE]", error);
    return new NextResponse(`Failed to delete network: ${error.message}`, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const networks = await prisma.affiliateNetwork.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        _count: {
          select: {
            offers: {
              where: {
                status: 'ACTIVE'
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(networks);
  } catch (error) {
    console.error("[NETWORKS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 