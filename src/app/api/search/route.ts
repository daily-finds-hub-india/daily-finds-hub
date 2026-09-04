import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q')?.trim() ?? '';

  if (!query) {
    return NextResponse.json({ success: true, products: [], categories: [] });
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { shortDescription: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true
      },
      orderBy: { createdAt: 'desc' },
      take: 6
    }),
    prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true
      },
      orderBy: { name: 'asc' },
      take: 6
    })
  ]);

  return NextResponse.json({ success: true, products, categories });
}
