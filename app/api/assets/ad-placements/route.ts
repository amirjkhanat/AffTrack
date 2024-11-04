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

    const adPlacements = await prisma.adPlacement.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        offer: true,
        splitTest: {
          include: {
            variants: {
              include: {
                offer: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(adPlacements);
  } catch (error) {
    console.error("[AD_PLACEMENTS_GET]", error);
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
    const adPlacement = await prisma.$transaction(async (tx) => {
      const adPlacement = await tx.adPlacement.create({
        data: {
          name: body.name,
          type: body.type,
          size: body.size,
          location: body.location,
          targetType: body.targetType,
          status: "ACTIVE",
          userId: session.user.id,
          ...(body.targetType === "OFFER" 
            ? { offerId: body.targetId }
            : { splitTestId: body.targetId }
          )
        },
        include: {
          offer: true,
          splitTest: {
            include: {
              variants: {
                include: {
                  offer: true
                }
              }
            }
          }
        }
      });

      await tx.activity.create({
        data: {
          type: "AD_PLACEMENT",
          action: "CREATE",
          targetType: "AD_PLACEMENT",
          targetId: adPlacement.id,
          userId: session.user.id,
          details: `Created ad placement: ${adPlacement.name}`,
          metadata: {
            placementName: adPlacement.name,
            placementType: adPlacement.type,
            targetType: adPlacement.targetType,
            target: body.targetType === "OFFER" 
              ? adPlacement.offer?.name 
              : adPlacement.splitTest?.name
          }
        }
      });

      return adPlacement;
    });

    return NextResponse.json(adPlacement);
  } catch (error) {
    console.error("[AD_PLACEMENTS_POST]", error);
    return new NextResponse(`Failed to create ad placement: ${error.message}`, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const adPlacement = await prisma.$transaction(async (tx) => {
      const adPlacement = await tx.adPlacement.update({
        where: {
          id: body.id,
          userId: session.user.id
        },
        data: {
          name: body.name,
          type: body.type,
          size: body.size,
          location: body.location,
          targetType: body.targetType,
          ...(body.targetType === "OFFER"
            ? { 
                offerId: body.targetId,
                splitTestId: null 
              }
            : { 
                splitTestId: body.targetId,
                offerId: null 
              }
          )
        },
        include: {
          offer: true,
          splitTest: {
            include: {
              variants: {
                include: {
                  offer: true
                }
              }
            }
          }
        }
      });

      await tx.activity.create({
        data: {
          type: "AD_PLACEMENT",
          action: "UPDATE",
          targetType: "AD_PLACEMENT",
          targetId: adPlacement.id,
          userId: session.user.id,
          details: `Updated ad placement: ${adPlacement.name}`
        }
      });

      return adPlacement;
    });

    return NextResponse.json(adPlacement);
  } catch (error) {
    console.error("[AD_PLACEMENTS_PUT]", error);
    return new NextResponse(`Failed to update ad placement: ${error.message}`, { status: 500 });
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
      const adPlacement = await tx.adPlacement.delete({
        where: {
          id,
          userId: session.user.id
        }
      });

      await tx.activity.create({
        data: {
          type: "AD_PLACEMENT",
          action: "DELETE",
          targetType: "AD_PLACEMENT",
          targetId: id,
          userId: session.user.id,
          details: `Deleted ad placement: ${adPlacement.name}`
        }
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[AD_PLACEMENTS_DELETE]", error);
    return new NextResponse(`Failed to delete ad placement: ${error.message}`, { status: 500 });
  }
} 