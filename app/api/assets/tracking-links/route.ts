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

    const trackingLinks = await prisma.trackingLink.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        name: true,
        url: true,  // Explicitly select the url field
        trafficSourceId: true,
        landingPageId: true,
        createdAt: true,
        updatedAt: true,
        trafficSource: {
          select: {
            id: true,
            name: true
          }
        },
        landingPage: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Fetched tracking links:', trackingLinks);

    return NextResponse.json(trackingLinks);
  } catch (error) {
    console.error("[TRACKING_LINKS_GET]", error);
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
    const trackingLink = await prisma.$transaction(async (tx) => {
      // Create the tracking link
      const trackingLink = await tx.trackingLink.create({
        data: {
          name: body.name,
          trafficSourceId: body.trafficSourceId,
          landingPageId: body.landingPageId,
          userId: session.user.id
        },
        include: {
          trafficSource: true,
          landingPage: true
        }
      });

      // Log the activity
      await tx.activity.create({
        data: {
          type: "TRACKING_LINK",
          action: "CREATE",
          targetType: "TRACKING_LINK",
          targetId: trackingLink.id,
          userId: session.user.id,
          details: `Created tracking link: ${trackingLink.name}`
        }
      });

      // Generate the tracking URL
      const trackingDomain = process.env.NEXT_PUBLIC_TRACKING_DOMAIN || 'https://track.yourdomain.com';
      const url = `${trackingDomain}/v/${trackingLink.id}`;

      return {
        ...trackingLink,
        url
      };
    });

    return NextResponse.json(trackingLink);
  } catch (error) {
    console.error("[TRACKING_LINKS_POST]", error);
    return new NextResponse(`Failed to create tracking link: ${error.message}`, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log('Updating tracking link with:', body); // Debug log

    const trackingLink = await prisma.$transaction(async (tx) => {
      const trackingLink = await tx.trackingLink.update({
        where: {
          id: body.id,
          userId: session.user.id
        },
        data: {
          name: body.name,
          trafficSourceId: body.trafficSourceId,
          landingPageId: body.landingPageId,
          url: body.url // Make sure this is being saved
        },
        include: {
          trafficSource: true,
          landingPage: true
        }
      });

      console.log('Updated tracking link:', trackingLink); // Debug log

      await tx.activity.create({
        data: {
          type: "TRACKING_LINK",
          action: "UPDATE",
          targetType: "TRACKING_LINK",
          targetId: trackingLink.id,
          userId: session.user.id,
          details: `Updated tracking link: ${trackingLink.name}`
        }
      });

      return trackingLink;
    });

    return NextResponse.json(trackingLink);
  } catch (error) {
    console.error("[TRACKING_LINKS_PUT]", error);
    return new NextResponse(`Failed to update tracking link: ${error.message}`, { status: 500 });
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
      const trackingLink = await tx.trackingLink.delete({
        where: {
          id,
          userId: session.user.id
        }
      });

      await tx.activity.create({
        data: {
          type: "TRACKING_LINK",
          action: "DELETE",
          targetType: "TRACKING_LINK",
          targetId: id,
          userId: session.user.id,
          details: `Deleted tracking link: ${trackingLink.name}`
        }
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[TRACKING_LINKS_DELETE]", error);
    return new NextResponse(`Failed to delete tracking link: ${error.message}`, { status: 500 });
  }
} 