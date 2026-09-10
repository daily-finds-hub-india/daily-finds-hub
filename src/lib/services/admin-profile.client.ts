// src/lib/services/admin-profile.client.ts
import { UpdateAdminInput } from '@/lib/validation/adminProfile';

export async function updateAdminProfileClient(data: UpdateAdminInput) {
  const response = await fetch('/api/admin/profile', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to update admin profile');
  }

  return result.data;
}

export async function runCloudinaryCleanupClient() {
  const response = await fetch('/api/admin/cloudinary/cleanup', {
    method: 'POST'
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to execute cleanup');
  }

  return result.data;
}
