import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { cloudinary } from '@/lib/cloudinary';
import { categoryUpdateSchema } from '@/lib/validation/category';

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { response } = await requireApiAdmin();

  if (response) {
    return response;
  }

  const { id } = await params;

  try {
    const category = await prisma.category.findUnique({
      where: {
        id
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

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category not found.'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Failed to fetch category:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch category.'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { response } = await requireApiAdmin();

  if (response) {
    return response;
  }

  const { id } = await params;

  try {
    const body: unknown = await request.json();
    const result = categoryUpdateSchema.safeParse(body);

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
        ],
        NOT: {
          id
        }
      },
      select: {
        id: true
      }
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: 'Another category with this name already exists.'
        },
        { status: 409 }
      );
    }

    const existingCategoryRecord = await prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        imagePublicId: true,
        images: {
          select: { publicId: true }
        }
      }
    });

    if (!existingCategoryRecord) {
      return NextResponse.json(
        { success: false, message: 'Category not found.' },
        { status: 404 }
      );
    }

    const category = await prisma.category.update({
      where: {
        id
      },
      data: {
        name: data.name,
        slug,
        description: data.description,
        image: primaryImage?.url ?? data.image,
        imagePublicId: primaryImage?.publicId ?? data.imagePublicId ?? null,
        isFeatured: data.isFeatured,
        images: {
          deleteMany: {},
          create: data.images.map((image, index) => ({
            url: image.url,
            publicId: image.publicId,
            altText: image.altText,
            isPrimary: image.isPrimary || (!primaryImage && index === 0),
            displayOrder: index
          }))
        }
      },
      include: {
        images: {
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }]
        }
      }
    });

    const retainedPublicIds = new Set(
      data.images.map((image) => image.publicId)
    );
    const previousPublicIds = [
      ...existingCategoryRecord.images.map((image) => image.publicId),
      existingCategoryRecord.imagePublicId
    ].filter((publicId): publicId is string => publicId !== null);
    const removedPublicIds = previousPublicIds.filter(
      (publicId) => !retainedPublicIds.has(publicId)
    );

    if (removedPublicIds.length > 0) {
      await Promise.all(
        [...new Set(removedPublicIds)].map((publicId) =>
          cloudinary.uploader.destroy(publicId, {
            resource_type: 'image',
            invalidate: true
          })
        )
      );
    }

    return NextResponse.json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Failed to update category:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update category.'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { response } = await requireApiAdmin();

  if (response) {
    return response;
  }

  const { id } = await params;

  try {
    const category = await prisma.category.findUnique({
      where: {
        id
      },
      include: {
        images: {
          select: { publicId: true }
        },
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category not found.'
        },
        { status: 404 }
      );
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            'This category cannot be deleted because products are assigned to it.'
        },
        { status: 409 }
      );
    }

    await prisma.category.delete({
      where: {
        id
      }
    });

    const publicIds = [
      ...category.images.map((image) => image.publicId),
      category.imagePublicId
    ].filter((publicId): publicId is string => Boolean(publicId));

    if (publicIds.length > 0) {
      await Promise.all(
        [...new Set(publicIds)].map((publicId) =>
          cloudinary.uploader.destroy(publicId, {
            resource_type: 'image',
            invalidate: true
          })
        )
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully.'
    });
  } catch (error) {
    console.error('Failed to delete category:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete category.'
      },
      { status: 500 }
    );
  }
}
