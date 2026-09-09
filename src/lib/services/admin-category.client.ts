import { Category, CategoryFormData } from '@/types/category';

export async function createAdminCategory(
  formData: CategoryFormData
): Promise<Category> {
  const payload = {
    name: formData.name.trim(),
    slug: formData.slug.trim(),
    description: formData.description.trim(),
    isFeatured: Boolean(formData.isFeatured),
    isPublished: Boolean(formData.isPublished)
  };

  const res = await fetch('/api/admin/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create category');
  }

  const result = await res.json();
  return result.data;
}

export async function updateAdminCategory(
  id: string,
  formData: CategoryFormData
): Promise<Category> {
  const payload = {
    name: formData.name.trim(),
    slug: formData.slug.trim(),
    description: formData.description.trim(),
    isFeatured: Boolean(formData.isFeatured),
    isPublished: Boolean(formData.isPublished)
  };

  const res = await fetch(`/api/admin/categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update category');
  }

  const result = await res.json();
  return result.data;
}

export async function deleteAdminCategory(id: string): Promise<void> {
  const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete category');
  }
}

export async function uploadCategoryImage(
  categoryId: string,
  file: File,
  altText: string,
  isPrimary: boolean,
  displayOrder: number
): Promise<{ id: string; url: string; publicId: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', `daily-finds-hub/categories/${categoryId}`);

  // 1. Upload through your own backend server route (No CORS)
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

  // 2. Register image record in DB
  const dbRes = await fetch(`/api/admin/categories/${categoryId}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      publicId,
      altText: altText || 'Category image',
      isPrimary,
      displayOrder
    })
  });

  if (!dbRes.ok) {
    const dbError = await dbRes.json().catch(() => ({}));
    throw new Error(
      dbError?.error || 'Failed to attach image to category database'
    );
  }

  const dbData = await dbRes.json();
  return dbData.data || dbData;
}

export async function updateCategoryImage(
  categoryId: string,
  imageId: string,
  data: { altText?: string; displayOrder?: number; isPrimary?: boolean }
): Promise<void> {
  const res = await fetch(
    `/api/admin/categories/${categoryId}/images/${imageId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error || 'Failed to update category image details'
    );
  }
}

export async function deleteCategoryImage(
  categoryId: string,
  imageId: string
): Promise<void> {
  const res = await fetch(
    `/api/admin/categories/${categoryId}/images/${imageId}`,
    { method: 'DELETE' }
  );
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete category image');
  }
}
