import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireApiAdmin } from '@/lib/auth/require-api-admin';
import { cloudinary } from '@/lib/cloudinary';

const MAX_ALT_TEXT_LENGTH = 200;

function isValidCloudinaryPublicId(publicId: string) {
  return (
    publicId.startsWith('daily-finds-hub/categories/') && publicId.length <= 300
  );
}

async function getCategory(id: string) {
  return prisma.category.findUnique({
    where: { id },
    select: { id: true }
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireApiAdmin();
  if (response) return response;

  const { id } = await params;

  try {
    if (!(await getCategory(id))) {
      return NextResponse.json(
        { success: false, message: 'Category not found.' },
        { status: 404 }
      );
    }

    const images = await prisma.categoryImage.findMany({
      where: { categoryId: id },
      orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }]
    });

    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error('Failed to fetch category images:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch category images.' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireApiAdmin();
  if (response) return response;

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
        { success: false, message: 'Image URL and public ID are required.' },
        { status: 400 }
      );
    }

    if (
      !isValidCloudinaryPublicId(publicId) ||
      !url.startsWith('https://res.cloudinary.com/')
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid Cloudinary image.' },
        { status: 400 }
      );
    }

    if (altText.length > MAX_ALT_TEXT_LENGTH) {
      return NextResponse.json(
        { success: false, message: 'Alt text is too long.' },
        { status: 400 }
      );
    }

    if (!(await getCategory(id))) {
      return NextResponse.json(
        { success: false, message: 'Category not found.' },
        { status: 404 }
      );
    }

    const imageCount = await prisma.categoryImage.count({
      where: { categoryId: id }
    });
    const shouldBePrimary = isPrimary || imageCount === 0;

    const image = await prisma.$transaction(async (transaction) => {
      if (shouldBePrimary) {
        await transaction.categoryImage.updateMany({
          where: { categoryId: id },
          data: { isPrimary: false }
        });
      }

      const createdImage = await transaction.categoryImage.create({
        data: {
          categoryId: id,
          url,
          publicId,
          altText: altText || 'Category image',
          isPrimary: shouldBePrimary,
          displayOrder: imageCount
        }
      });

      if (shouldBePrimary) {
        await transaction.category.update({
          where: { id },
          data: { image: url, imagePublicId: publicId }
        });
      }

      return createdImage;
    });

    return NextResponse.json({ success: true, image }, { status: 201 });
  } catch (error) {
    console.error('Failed to save category image:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save category image.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireApiAdmin();
  if (response) return response;

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
        { success: false, message: 'Image ID is required.' },
        { status: 400 }
      );
    }

    if (hasAltText && altText.length > MAX_ALT_TEXT_LENGTH) {
      return NextResponse.json(
        { success: false, message: 'Alt text is too long.' },
        { status: 400 }
      );
    }

    const image = await prisma.categoryImage.findFirst({
      where: { id: imageId, categoryId: id }
    });

    if (!image) {
      return NextResponse.json(
        { success: false, message: 'Category image not found.' },
        { status: 404 }
      );
    }

    const updatedImage = await prisma.$transaction(async (transaction) => {
      if (makePrimary) {
        await transaction.categoryImage.updateMany({
          where: { categoryId: id },
          data: { isPrimary: false }
        });
      }

      const nextImage = await transaction.categoryImage.update({
        where: { id: imageId },
        data: {
          ...(makePrimary ? { isPrimary: true } : {}),
          ...(hasAltText ? { altText } : {})
        }
      });

      if (makePrimary) {
        await transaction.category.update({
          where: { id },
          data: { image: nextImage.url, imagePublicId: nextImage.publicId }
        });
      }

      return nextImage;
    });

    return NextResponse.json({ success: true, image: updatedImage });
  } catch (error) {
    console.error('Failed to update category image:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update category image.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireApiAdmin();
  if (response) return response;

  const { id } = await params;

  try {
    const body = await request.json();
    const imageId =
      typeof body?.imageId === 'string' ? body.imageId.trim() : '';

    if (!imageId) {
      return NextResponse.json(
        { success: false, message: 'Image ID is required.' },
        { status: 400 }
      );
    }

    const image = await prisma.categoryImage.findFirst({
      where: { id: imageId, categoryId: id }
    });

    if (!image) {
      return NextResponse.json(
        { success: false, message: 'Category image not found.' },
        { status: 404 }
      );
    }

    await prisma.categoryImage.delete({ where: { id: imageId } });

    try {
      await cloudinary.uploader.destroy(image.publicId, {
        resource_type: 'image',
        invalidate: true
      });
    } catch (cloudinaryError) {
      console.error('Failed to delete Cloudinary image:', cloudinaryError);
    }

    if (image.isPrimary) {
      const replacement = await prisma.categoryImage.findFirst({
        where: { categoryId: id },
        orderBy: { displayOrder: 'asc' }
      });

      if (replacement) {
        await prisma.categoryImage.update({
          where: { id: replacement.id },
          data: { isPrimary: true }
        });
      }

      await prisma.category.update({
        where: { id },
        data: {
          image: replacement?.url ?? '',
          imagePublicId: replacement?.publicId ?? null
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Category image deleted successfully.'
    });
  } catch (error) {
    console.error('Failed to delete category image:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete category image.' },
      { status: 500 }
    );
  }
}
