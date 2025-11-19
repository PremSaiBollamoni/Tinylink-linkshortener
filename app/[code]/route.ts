import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface Params {
  code: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { code } = await params;

    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }

    // Update click count and last clicked time
    await prisma.link.update({
      where: { code },
      data: {
        clicks: link.clicks + 1,
        lastClicked: new Date(),
      },
    });

    // Return 302 redirect
    return NextResponse.redirect(link.targetUrl, { status: 302 });
  } catch (error) {
    console.error('Error processing redirect:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
