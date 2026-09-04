import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { cloudinary } from '@/lib/cloudinary';

const MAX_ALT_TEXT_LENGTH = 200;

function isValidCloudinaryPublicId(publicId) {
  return (
    publicId.startsWith('daily-finds-hub/products/') && publicId.length <= 300
  );
}

export async function GET(_request, { params }) {
  const { response } = await requireApiAdmin();

  if (response) {
    return response;
  }

  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true }
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

    const images = await prisma.productImage.findMany({
      where: { productId: id },
      orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }]
    });

    return NextResponse.json({
      success: true,
      images
    });
  } catch (error) {
    console.error('Failed to fetch product images:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch product images.'
      },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  const { response } = await requireApiAdmin();

  if (response) {
    return response;
  }

  const { id } = await params;

  try {
    const body = await request.json();

    const url = typeof body?.url === 'string' ? body.url.trim() : '';

    const publicId =
      typeof body?.publicId === 'string' ? body.publicId.trim() : '';

    const altText =
      typeof body?.altText === 'string' ? body.altText.trim() : '';

    const isPrimary = body?.isPrimary === true;

    if (!url || !publicId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Image URL and public ID are required.'
        },
        { status: 400 }
      );
    }

    if (!isValidCloudinaryPublicId(publicId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid Cloudinary image.'
        },
        { status: 400 }
      );
    }

    if (!url.startsWith('https://res.cloudinary.com/')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid image URL.'
        },
        { status: 400 }
      );
    }

    if (altText.length > MAX_ALT_TEXT_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          message: 'Alt text is too long.'
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true }
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

    const imageCount = await prisma.productImage.count({
      where: { productId: id }
    });

    const shouldBePrimary = isPrimary || imageCount === 0;

    const image = await prisma.$transaction(async (transaction) => {
      if (shouldBePrimary) {
        await transaction.productImage.updateMany({
          where: { productId: id },
          data: { isPrimary: false }
        });
      }

      return transaction.productImage.create({
        data: {
          productId: id,
          url,
          publicId,
          altText: altText || 'Product image',
          isPrimary: shouldBePrimary,
          displayOrder: imageCount
        }
      });
    });

    return NextResponse.json(
      {
        success: true,
        image
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to save product image:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to save product image.'
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

    const imageId =
      typeof body?.imageId === 'string' ? body.imageId.trim() : '';
    const hasAltText = typeof body?.altText === 'string';
    const altText = hasAltText ? body.altText.trim() : '';
    const makePrimary = body?.isPrimary === true;

    if (!imageId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Image ID is required.'
        },
        { status: 400 }
      );
    }

    if (hasAltText && altText.length > MAX_ALT_TEXT_LENGTH) {
      return NextResponse.json(
        { success: false, message: 'Alt text is too long.' },
        { status: 400 }
      );
    }

    const image = await prisma.productImage.findFirst({
      where: {
        id: imageId,
        productId: id
      }
    });

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product image not found.'
        },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (transaction) => {
      if (makePrimary) {
        await transaction.productImage.updateMany({
          where: { productId: id },
          data: { isPrimary: false }
        });
      }

      await transaction.productImage.update({
        where: { id: imageId },
        data: {
          ...(makePrimary ? { isPrimary: true } : {}),
          ...(hasAltText ? { altText } : {})
        }
      });
    });

    const updatedImage = await prisma.productImage.findUnique({
      where: { id: imageId }
    });

    return NextResponse.json({
      success: true,
      image: updatedImage
    });
  } catch (error) {
    console.error('Failed to update product image:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update product image.'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { response } = await requireApiAdmin();

  if (response) {
    return response;
  }

  const { id } = await params;

  try {
    const body = await request.json();

    const imageId =
      typeof body?.imageId === 'string' ? body.imageId.trim() : '';

    if (!imageId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Image ID is required.'
        },
        { status: 400 }
      );
    }

    const image = await prisma.productImage.findFirst({
      where: {
        id: imageId,
        productId: id
      }
    });

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product image not found.'
        },
        { status: 404 }
      );
    }

    await prisma.productImage.delete({
      where: { id: imageId }
    });

    if (image.publicId) {
      try {
        await cloudinary.uploader.destroy(image.publicId, {
          resource_type: 'image',
          invalidate: true
        });
      } catch (cloudinaryError) {
        console.error('Failed to delete Cloudinary image:', cloudinaryError);
      }
    }

    if (image.isPrimary) {
      const replacement = await prisma.productImage.findFirst({
        where: { productId: id },
        orderBy: { displayOrder: 'asc' }
      });

      if (replacement) {
        await prisma.productImage.update({
          where: { id: replacement.id },
          data: { isPrimary: true }
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Product image deleted successfully.'
    });
  } catch (error) {
    console.error('Failed to delete product image:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete product image.'
      },
      { status: 500 }
    );
  }
}
