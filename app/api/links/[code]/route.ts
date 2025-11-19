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
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(link, { status: 200 });
  } catch (error) {
    console.error('Error fetching link:', error);
    return NextResponse.json(
      { error: 'Failed to fetch link' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    await prisma.link.delete({
      where: { code },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { error: 'Failed to delete link' },
      { status: 500 }
    );
  }
}
