import { Product, ProductFormData } from '@/types/product';

export async function createAdminProduct(
  formData: ProductFormData
): Promise<Product> {
  const payload = {
    name: formData.name.trim(),
    slug: formData.slug.trim(),
    shortDescription: formData.shortDescription.trim(),
    description: formData.description.trim(),
    categoryId: formData.categoryId,
    price: Number(formData.price),
    originalPrice: formData.originalPrice
      ? Number(formData.originalPrice)
      : null,
    rating: formData.rating ? Number(formData.rating) : null,
    reviewCount: formData.reviewCount ? Number(formData.reviewCount) : 0,
    amazonUrl: formData.amazonUrl ? formData.amazonUrl.trim() : null,
    asin: formData.asin ? formData.asin.trim() : null,
    isFeatured: Boolean(formData.isFeatured),
    isTrending: Boolean(formData.isTrending),
    isPublished: Boolean(formData.isPublished)
  };

  const res = await fetch('/api/admin/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create product');
  }

  const result = await res.json();
  return result.data;
}

export async function updateAdminProduct(
  id: string,
  formData: ProductFormData
): Promise<Product> {
  const payload = {
    name: formData.name.trim(),
    slug: formData.slug.trim(),
    shortDescription: formData.shortDescription.trim(),
    description: formData.description.trim(),
    categoryId: formData.categoryId,
    price: Number(formData.price),
    originalPrice: formData.originalPrice
      ? Number(formData.originalPrice)
      : null,
    rating: formData.rating ? Number(formData.rating) : null,
    reviewCount: formData.reviewCount ? Number(formData.reviewCount) : 0,
    amazonUrl: formData.amazonUrl ? formData.amazonUrl.trim() : null,
    asin: formData.asin ? formData.asin.trim() : null,
    isFeatured: Boolean(formData.isFeatured),
    isTrending: Boolean(formData.isTrending),
    isPublished: Boolean(formData.isPublished)
  };

  const res = await fetch(`/api/admin/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update product');
  }

  const result = await res.json();
  return result.data;
}

export async function deleteAdminProduct(id: string): Promise<void> {
  const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete product');
  }
}

export async function uploadProductImage(
  productId: string,
  file: File,
  altText: string = 'Product image',
  isPrimary: boolean = false
): Promise<{
  id: string;
  url: string;
  publicId: string;
  altText: string;
  isPrimary: boolean;
  displayOrder: number;
  createdAt: string;
}> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', `daily-finds-hub/products/${productId}`);

  const uploadRes = await fetch('/api/admin/upload', {
    method: 'POST',
    body: formData
  });

  if (!uploadRes.ok) {
    const errorJson = await uploadRes.json().catch(() => ({}));
    throw new Error(errorJson?.error || 'Failed to upload image file');
  }

  const uploadData = await uploadRes.json();
  const { url, publicId } = uploadData.data;

  const dbRes = await fetch(`/api/admin/products/${productId}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      publicId,
      altText: altText || 'Product image',
      isPrimary
    })
  });

  if (!dbRes.ok) {
    const dbError = await dbRes.json().catch(() => ({}));
    throw new Error(
      dbError?.error || 'Failed to attach image to product database'
    );
  }

  const dbData = await dbRes.json();
  return dbData.data || dbData;
}

export async function updateProductImage(
  productId: string,
  imageId: string,
  data: { altText?: string; displayOrder?: number; isPrimary?: boolean }
): Promise<void> {
  const res = await fetch(
    `/api/admin/products/${productId}/images/${imageId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error || 'Failed to update product image details'
    );
  }
}

export async function deleteProductImage(
  productId: string,
  imageId: string
): Promise<void> {
  const res = await fetch(
    `/api/admin/products/${productId}/images/${imageId}`,
    { method: 'DELETE' }
  );
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete product image');
  }
}
