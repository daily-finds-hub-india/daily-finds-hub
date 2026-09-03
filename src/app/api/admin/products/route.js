import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { productCreateSchema } from '@/lib/validation/product';

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function serializeProduct(product) {
  return {
    ...product,
    price: product.price?.toString() ?? null,
    originalPrice: product.originalPrice?.toString() ?? null,
    rating: product.rating?.toString() ?? null
  };
}

export async function GET() {
  const { response } = await requireApiAdmin();

  if (response) {
    return response;
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            images: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      products: products.map(serializeProduct)
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch products.'
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { response } = await requireApiAdmin();

  if (response) {
    return response;
  }

  try {
    const body = await request.json();

    const parsed = productCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid product data.',
          errors: parsed.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId
      },
      select: {
        id: true
      }
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: 'Selected category does not exist.'
        },
        { status: 400 }
      );
    }

    const slug = createSlug(data.name);

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product name cannot produce a valid slug.'
        },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        OR: [
          {
            name: {
              equals: data.name,
              mode: 'insensitive'
            }
          },
          {
            slug
          }
        ]
      },
      select: {
        id: true
      }
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: 'A product with this name already exists.'
        },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        shortDescription: data.shortDescription,
        description: data.description,
        categoryId: data.categoryId,
        price: data.price,
        originalPrice: data.originalPrice,
        rating: data.rating,
        reviewCount: data.reviewCount,
        amazonUrl: data.amazonUrl || null,
        asin: data.asin,
        isFeatured: data.isFeatured,
        isTrending: data.isTrending,
        isPublished: data.isPublished
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            images: true
          }
        }
      }
    });

    return NextResponse.json(
      {
        success: true,
        product: serializeProduct(product)
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create product:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create product.'
      },
      { status: 500 }
    );
  }
}
