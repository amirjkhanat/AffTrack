import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const conversion = await prisma.conversion.findUnique({
      where: { id: params.id },
      include: {
        visitor: true,
        click: {
          include: {
            trackingLink: {
              include: {
                placement: {
                  include: {
                    splitTest: true
                  }
                }
              }
            }
          }
        },
        lead: true,
        offer: true,
        transfer: true
      }
    });

    if (!conversion) {
      return NextResponse.json(
        { error: "Conversion not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: conversion });

  } catch (error) {
    console.error('Conversion lookup error:', error);
    return NextResponse.json(
      { error: "Failed to retrieve conversion" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status, value, metadata } = body;

    const conversion = await prisma.conversion.update({
      where: { id: params.id },
      data: {
        status,
        value,
        metadata: {
          ...metadata,
          updatedBy: user.id,
          updatedAt: new Date()
        }
      }
    });

    // Log status change
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'OFFER',
        action: 'UPDATE',
        targetType: 'CONVERSION',
        targetId: conversion.id,
        details: `Conversion status updated to ${status}`,
        metadata: {
          previousStatus: conversion.status,
          newStatus: status,
          value
        }
      }
    });

    return NextResponse.json({ data: conversion });

  } catch (error) {
    console.error('Conversion update error:', error);
    return NextResponse.json(
      { error: "Failed to update conversion" },
      { status: 500 }
    );
  }
}