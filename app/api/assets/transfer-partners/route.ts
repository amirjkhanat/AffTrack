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
    const partner = await prisma.$transaction(async (tx) => {
      const partner = await tx.transferPartner.create({
        data: {
          name: body.name,
          website: body.website,
          apiEndpoint: body.apiEndpoint,
          username: body.username,
          password: body.password,
          description: body.description,
          status: body.status || "ACTIVE",
          userId: session.user.id
        }
      });

      await tx.activity.create({
        data: {
          type: "TRANSFER_PARTNER",
          action: "CREATE",
          userId: session.user.id,
          targetType: "TRANSFER_PARTNER",
          targetId: partner.id,
          details: `Created transfer partner: ${partner.name}`
        }
      });

      return partner;
    });

    return NextResponse.json(partner);
  } catch (error) {
    console.error("[TRANSFER_PARTNERS_POST]", error);
    return new NextResponse(`Failed to create transfer partner: ${error.message}`, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const partner = await prisma.$transaction(async (tx) => {
      const partner = await tx.transferPartner.update({
        where: {
          id: body.id,
          userId: session.user.id
        },
        data: {
          name: body.name,
          website: body.website,
          apiEndpoint: body.apiEndpoint,
          username: body.username,
          password: body.password,
          description: body.description,
          status: body.status
        }
      });

      await tx.activity.create({
        data: {
          type: "TRANSFER_PARTNER",
          action: "UPDATE",
          userId: session.user.id,
          targetType: "TRANSFER_PARTNER",
          targetId: partner.id,
          details: `Updated transfer partner: ${partner.name}`
        }
      });

      return partner;
    });

    return NextResponse.json(partner);
  } catch (error) {
    console.error("[TRANSFER_PARTNERS_PUT]", error);
    return new NextResponse(`Failed to update transfer partner: ${error.message}`, { status: 500 });
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
      const partner = await tx.transferPartner.delete({
        where: {
          id,
          userId: session.user.id
        }
      });

      await tx.activity.create({
        data: {
          type: "TRANSFER_PARTNER",
          action: "DELETE",
          userId: session.user.id,
          targetType: "TRANSFER_PARTNER",
          targetId: id,
          details: `Deleted transfer partner: ${partner.name}`
        }
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[TRANSFER_PARTNERS_DELETE]", error);
    return new NextResponse(`Failed to delete transfer partner: ${error.message}`, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const partners = await prisma.transferPartner.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        name: true,
        website: true,
        description: true,
        username: true,
        password: true,
        status: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Fetched transfer partners:', partners);

    return NextResponse.json(partners);
  } catch (error) {
    console.error("[TRANSFER_PARTNERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 