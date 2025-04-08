import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const offers = await prisma.affiliateOffer.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        affiliateNetwork: true, // Подгружаем связанные данные о сети
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(offers);
  } catch (error) {
    console.error("[OFFERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const offer = await prisma.$transaction(async (tx) => {
      const offer = await tx.affiliateOffer.create({
        data: {
          name: body.name,
          type: body.type,
          payout: parseFloat(body.payout || '0'),
          description: body.description,
          url: body.url,
          status: body.status || "ACTIVE",
          affiliateNetworkId: body.affiliateNetworkId, // Используем только ID сети
          userId: session.user.id,
        },
        include: {
          affiliateNetwork: true, // Включаем данные о сети в ответ
        }
      });

      await tx.activity.create({
        data: {
          type: "OFFER",
          action: "CREATE",
          userId: session.user.id,
          details: `Created offer: ${offer.name}`,
          targetType: "OFFER",
          targetId: offer.id
        }
      });

      return offer;
    });

    return NextResponse.json(offer);
  } catch (error) {
    console.error("[OFFERS_POST]", error);
    return new NextResponse(`Failed to create offer: ${error.message}`, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log('Update body:', body);

    const offer = await prisma.affiliateOffer.update({
      where: {
        id: body.id,
        userId: session.user.id
      },
      data: {
        name: body.name,
        type: body.type,
        payout: parseFloat(body.payout || '0'),
        description: body.description,
        url: body.url,
        status: body.status,
        affiliateNetworkId: body.affiliateNetworkId // Используем только ID сети
      },
      include: {
        affiliateNetwork: true // Включаем данные о сети в ответ
      }
    });

    return NextResponse.json(offer);
  } catch (error) {
    console.error("[OFFERS_PUT]", error);
    return new NextResponse(`Failed to update offer: ${error.message}`, { status: 500 });
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
      const offer = await tx.affiliateOffer.delete({
        where: {
          id,
          userId: session.user.id
        }
      });

      await tx.activity.create({
        data: {
          type: "OFFER",
          action: "DELETE",
          userId: session.user.id,
          details: `Deleted offer: ${offer.name}`,
          targetType: "OFFER",
          targetId: offer.id
        }
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[OFFERS_DELETE]", error);
    return new NextResponse(`Failed to delete offer: ${error.message}`, { status: 500 });
  }
}