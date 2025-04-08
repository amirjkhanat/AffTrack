import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const id = params.id;
    const body = await request.json();
    
    // Check if a network with this name already exists (excluding current network)
    const existingNetwork = await prisma.affiliateNetwork.findFirst({
      where: {
        name: body.name,
        id: { not: id },
        userId: session.user.id
      },
    });

    if (existingNetwork) {
      return NextResponse.json(
        { 
          error: "Network name already exists", 
          code: "P2002", 
          meta: { target: ["name"] } 
        }, 
        { status: 409 }
      );
    }
    
    const network = await prisma.$transaction(async (tx) => {
      const network = await tx.affiliateNetwork.update({
        where: {
          id,
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
          type: "AFFILIATE_NETWORK", // Changed from "NETWORK" to "AFFILIATE_NETWORK"
          action: "UPDATE",
          userId: session.user.id,
          details: `Updated affiliate network: ${network.name}`,
          targetType: "AFFILIATE_NETWORK", // Changed from "NETWORK" to "AFFILIATE_NETWORK"
          targetId: network.id,
          metadata: { ...body, password: undefined } // Don't log password
        }
      });

      return network;
    });

    return NextResponse.json(network);
  } catch (error: any) {
    console.error("[NETWORKS_PUT]", error);
    return NextResponse.json(
      { error: `Failed to update network: ${error.message}` }, 
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const id = params.id;
    
    const network = await prisma.affiliateNetwork.findUnique({
      where: { 
        id,
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
      }
    });

    if (!network) {
      return NextResponse.json({ error: "Network not found" }, { status: 404 });
    }

    return NextResponse.json(network);
  } catch (error: any) {
    console.error("[NETWORKS_GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const id = params.id;
    
    await prisma.$transaction(async (tx) => {
      const network = await tx.affiliateNetwork.delete({
        where: {
          id,
          userId: session.user.id
        }
      });

      await tx.activity.create({
        data: {
          type: "AFFILIATE_NETWORK", // Changed from "NETWORK" to "AFFILIATE_NETWORK"
          action: "DELETE",
          userId: session.user.id,
          details: `Deleted affiliate network: ${network.name}`,
          targetType: "AFFILIATE_NETWORK", // Changed from "NETWORK" to "AFFILIATE_NETWORK"
          targetId: id
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[NETWORKS_DELETE]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
