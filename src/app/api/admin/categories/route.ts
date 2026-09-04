import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { categoryCreateSchema } from '@/lib/validation/category';

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function GET() {
  const { response } = await requireApiAdmin();

  if (response) {
    return response;
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        images: {
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }]
        },
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch categories.'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { response } = await requireApiAdmin();

  if (response) {
    return response;
  }

  try {
    const body: unknown = await request.json();
    const result = categoryCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid category data.',
          errors: result.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const data = result.data;
    const slug = createSlug(data.name);
    const primaryImage =
      data.images.find((image) => image.isPrimary) ?? data.images[0];

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category name cannot produce a valid slug.'
        },
        { status: 400 }
      );
    }

    const existingCategory = await prisma.category.findFirst({
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

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: 'A category with this name already exists.'
        },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        image: primaryImage?.url ?? data.image,
        imagePublicId: primaryImage?.publicId ?? data.imagePublicId ?? null,
        isFeatured: data.isFeatured,
        images: {
          create: data.images.map((image, index) => ({
            url: image.url,
            publicId: image.publicId,
            altText: image.altText,
            isPrimary: image.isPrimary || (!primaryImage && index === 0),
            displayOrder: index
          }))
        }
      }
    });

    return NextResponse.json(
      {
        success: true,
        category
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create category:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create category.'
      },
      { status: 500 }
    );
  }
}
