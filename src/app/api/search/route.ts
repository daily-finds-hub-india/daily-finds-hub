import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({
      success: true,
      categories: [],
      products: []
    });
  }

  try {
    const [categories, products] = await Promise.all([
      // 1. Fetch matching categories
      prisma.category.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' }
        },
        take: 4,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true
        }
      }),

      // 2. Fetch matching products
      prisma.product.findMany({
        where: {
          isPublished: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { shortDescription: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { name: { contains: query, mode: 'insensitive' } } }
          ]
        },
        take: 6,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          shortDescription: true,
          category: {
            select: {
              name: true
            }
          },
          images: {
            orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
            take: 1,
            select: {
              url: true
            }
          }
        }
      })
    ]);

    const formattedProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      shortDescription: p.shortDescription ?? '',
      categoryName: p.category.name,
      imageUrl: p.images[0]?.url ?? null
    }));

    return NextResponse.json({
      success: true,
      categories,
      products: formattedProducts
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Search query failed.',
        categories: [],
        products: []
      },
      { status: 500 }
    );
  }
}
