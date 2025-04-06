import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    
    console.log("Session user:", session.user);
    console.log("Request body:", body);

    const landingPage = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: session.user.id }
      });

      if (!user) {
        throw new Error("User not found");
      }

      const landingPage = await tx.landingPage.create({
        data: {
          name: body.name,
          baseUrl: body.baseUrl,
          parameters: body.parameters || {},
          description: body.description || "",
          userId: session.user.id,
        }
      });

      await tx.activity.create({
        data: {
          type: "LANDING_PAGE",
          action: "CREATE",
          userId: session.user.id,
          targetType: "LANDING_PAGE",
          targetId: landingPage.id,
          details: `Created landing page: ${landingPage.name}`,
          metadata: { ...body }
        }
      });

      return landingPage;
    });

    return NextResponse.json(landingPage);
  } catch (error) {
    console.error("[LANDING_PAGES_POST]", error);
    return new NextResponse(
      `Failed to create landing page: ${error.message}`, 
      { status: error.code === 'P2003' ? 400 : 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const landingPage = await prisma.$transaction(async (tx) => {
      const landingPage = await tx.landingPage.update({
        where: {
          id: body.id,
          userId: session.user.id
        },
        data: {
          name: body.name,
          baseUrl: body.baseUrl,
          parameters: body.parameters,
          description: body.description
        }
      });

      await tx.activity.create({
        data: {
          type: "LANDING_PAGE",
          action: "UPDATE",
          userId: session.user.id,
          targetType: "LANDING_PAGE",
          targetId: landingPage.id,
          details: `Updated landing page: ${landingPage.name}`,
          metadata: { ...body }
        }
      });

      return landingPage;
    });

    return NextResponse.json(landingPage);
  } catch (error) {
    console.error("[LANDING_PAGES_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
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
      const landingPage = await tx.landingPage.delete({
        where: {
          id,
          userId: session.user.id
        }
      });

      await tx.activity.create({
        data: {
          type: "LANDING_PAGE",
          action: "DELETE",
          userId: session.user.id,
          targetType: "LANDING_PAGE",
          targetId: id,
          details: `Deleted landing page: ${landingPage.name}`,
          metadata: { id }
        }
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[LANDING_PAGES_DELETE]", error);
    return new NextResponse(`Failed to delete landing page: ${error.message}`, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const landingPages = await prisma.landingPage.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(landingPages);
  } catch (error) {
    console.error("[LANDING_PAGES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 