type AdminResponse<T> = T & {
  success: boolean;
  message?: string;
};

async function getAdminResource<T>(
  path: string,
  fallbackMessage: string
): Promise<T> {
  const response = await fetch(path);
  const data = (await response.json()) as AdminResponse<T>;

  if (!response.ok || !data.success) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
}

export function getAdminProducts<T>() {
  return getAdminResource<T>('/api/admin/products', 'Failed to load products.');
}

export function getAdminCategories<T>() {
  return getAdminResource<T>(
    '/api/admin/categories',
    'Failed to load categories.'
  );
}
