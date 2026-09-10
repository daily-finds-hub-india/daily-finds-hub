import { getAdminProfileData } from '@/lib/services/admin-profile.server';
import { ProfileClientView } from '@/components/admin/profile/ProfileClientView';

export const revalidate = 0;

export default async function AdminProfilePage() {
  const { admin, pendingCleanupCount } = await getAdminProfileData();

  return (
    <ProfileClientView
      admin={admin}
      initialPendingCount={pendingCleanupCount}
    />
  );
}
