import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateRandomCode, isValidCode, isValidUrl } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetUrl, code } = body;

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'targetUrl is required' },
        { status: 400 }
      );
    }

    if (!isValidUrl(targetUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    let shortCode = code;

    if (shortCode) {
      if (!isValidCode(shortCode)) {
        return NextResponse.json(
          { error: 'Code must be 6-8 alphanumeric characters' },
          { status: 400 }
        );
      }

      const existing = await prisma.link.findUnique({
        where: { code: shortCode },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'Code already exists' },
          { status: 409 }
        );
      }
    } else {
      shortCode = generateRandomCode();

      while (await prisma.link.findUnique({ where: { code: shortCode } })) {
        shortCode = generateRandomCode();
      }
    }

    const link = await prisma.link.create({
      data: {
        code: shortCode,
        targetUrl,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(links, { status: 200 });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}
