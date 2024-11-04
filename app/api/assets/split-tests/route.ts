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

    const splitTests = await prisma.splitTest.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        variants: {
          include: {
            offer: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(splitTests);
  } catch (error) {
    console.error("[SPLIT_TESTS_GET]", error);
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
    const splitTest = await prisma.$transaction(async (tx) => {
      const splitTest = await tx.splitTest.create({
        data: {
          name: body.name,
          description: body.description,
          status: body.status || "ACTIVE",
          startDate: body.startDate ? new Date(body.startDate) : null,
          endDate: body.endDate ? new Date(body.endDate) : null,
          userId: session.user.id,
          variants: {
            create: body.variants.map((variant: any) => ({
              name: variant.name,
              offerId: variant.offerId,
              weight: variant.weight || 1
            }))
          }
        },
        include: {
          variants: {
            include: {
              offer: true
            }
          }
        }
      });

      await tx.activity.create({
        data: {
          type: "SPLIT_TEST",
          action: "CREATE",
          targetType: "SPLIT_TEST",
          targetId: splitTest.id,
          userId: session.user.id,
          details: `Created split test: ${splitTest.name}`,
          metadata: {
            testName: splitTest.name,
            variantCount: splitTest.variants.length,
            variants: splitTest.variants.map(v => ({
              name: v.name,
              weight: v.weight,
              offer: v.offer.name
            }))
          }
        }
      });

      return splitTest;
    });

    return NextResponse.json(splitTest);
  } catch (error) {
    console.error("[SPLIT_TESTS_POST]", error);
    return new NextResponse(`Failed to create split test: ${error.message}`, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const splitTest = await prisma.$transaction(async (tx) => {
      // Delete removed variants
      if (body.removedVariantIds?.length) {
        await tx.splitTestVariant.deleteMany({
          where: {
            id: { in: body.removedVariantIds }
          }
        });
      }

      const splitTest = await tx.splitTest.update({
        where: {
          id: body.id,
          userId: session.user.id
        },
        data: {
          name: body.name,
          description: body.description,
          status: body.status,
          startDate: body.startDate ? new Date(body.startDate) : null,
          endDate: body.endDate ? new Date(body.endDate) : null,
          variants: {
            upsert: body.variants.map((variant: any) => ({
              where: { id: variant.id || 'new' },
              create: {
                name: variant.name,
                offerId: variant.offerId,
                weight: variant.weight || 1
              },
              update: {
                name: variant.name,
                offerId: variant.offerId,
                weight: variant.weight || 1
              }
            }))
          }
        },
        include: {
          variants: {
            include: {
              offer: true
            }
          }
        }
      });

      await tx.activity.create({
        data: {
          type: "SPLIT_TEST",
          action: "UPDATE",
          targetType: "SPLIT_TEST",
          targetId: splitTest.id,
          userId: session.user.id,
          details: `Updated split test: ${splitTest.name}`,
          metadata: {
            testName: splitTest.name,
            variantCount: splitTest.variants.length,
            variants: splitTest.variants.map(v => ({
              name: v.name,
              weight: v.weight,
              offer: v.offer.name
            }))
          }
        }
      });

      return splitTest;
    });

    return NextResponse.json(splitTest);
  } catch (error) {
    console.error("[SPLIT_TESTS_PUT]", error);
    return new NextResponse(`Failed to update split test: ${error.message}`, { status: 500 });
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
      const splitTest = await tx.splitTest.delete({
        where: {
          id,
          userId: session.user.id
        },
        include: {
          variants: true
        }
      });

      await tx.activity.create({
        data: {
          type: "SPLIT_TEST",
          action: "DELETE",
          targetType: "SPLIT_TEST",
          targetId: id,
          userId: session.user.id,
          details: `Deleted split test: ${splitTest.name}`,
          metadata: {
            testName: splitTest.name,
            variantCount: splitTest.variants.length
          }
        }
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[SPLIT_TESTS_DELETE]", error);
    return new NextResponse(`Failed to delete split test: ${error.message}`, { status: 500 });
  }
} 