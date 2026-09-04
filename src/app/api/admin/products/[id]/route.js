import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { cloudinary } from '@/lib/cloudinary';
import { productUpdateSchema } from '@/lib/validation/product';

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

export async function GET(_request, { params }) {
  const { response } = await requireApiAdmin();

  if (response) {
    return response;
  }

  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id
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

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not found.'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: serializeProduct(product)
    });
  } catch (error) {
    console.error('Failed to fetch product:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch product.'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { response } = await requireApiAdmin();

  if (response) {
    return response;
  }

  const { id } = await params;

  try {
    const body = await request.json();

    const parsed = productUpdateSchema.safeParse(body);

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

    const [product, category, existingProduct] = await Promise.all([
      prisma.product.findUnique({
        where: {
          id
        },
        select: {
          id: true
        }
      }),

      prisma.category.findUnique({
        where: {
          id: data.categoryId
        },
        select: {
          id: true
        }
      }),

      prisma.product.findFirst({
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
      })
    ]);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not found.'
        },
        { status: 404 }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: 'Selected category does not exist.'
        },
        { status: 400 }
      );
    }

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: 'A product with this name already exists.'
        },
        { status: 409 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id
      },
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
        isPublished: data.isPublished,
        images: {
          deleteMany: {},
          create: data.images.map((image, index) => ({
            url: image.url,
            publicId: image.publicId,
            altText: image.altText,
            isPrimary: image.isPrimary,
            displayOrder: index
          }))
        }
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
      product: serializeProduct(updatedProduct)
    });
  } catch (error) {
    console.error('Failed to update product:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update product.'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  const { response } = await requireApiAdmin();

  if (response) {
    return response;
  }

  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        images: {
          select: {
            publicId: true
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product not found.'
        },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: {
        id
      }
    });

    /*
     * ProductImage records are removed automatically because
     * the Product -> ProductImage relation uses onDelete: Cascade.
     *
     * Cloudinary assets need to be removed separately because
     * they are outside the database.
     */
    const publicIds = product.images
      .map((image) => image.publicId)
      .filter(Boolean);

    if (publicIds.length > 0) {
      try {
        await Promise.all(
          publicIds.map((publicId) =>
            cloudinary.uploader.destroy(publicId, {
              resource_type: 'image',
              invalidate: true
            })
          )
        );
      } catch (cloudinaryError) {
        console.error(
          'Failed to delete one or more Cloudinary images:',
          cloudinaryError
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (error) {
    console.error('Failed to delete product:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete product.'
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed.'
    },
    { status: 405 }
  );
}
