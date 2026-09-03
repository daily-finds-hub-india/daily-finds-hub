import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function requireApiAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      admin: null,
      response: NextResponse.json(
        {
          success: false,
          message: 'Unauthorized'
        },
        { status: 401 }
      )
    };
  }

  const admin = await prisma.adminUser.findUnique({
    where: {
      id: session.user.id
    },
    select: {
      id: true,
      username: true,
      isActive: true
    }
  });

  if (!admin || !admin.isActive) {
    return {
      admin: null,
      response: NextResponse.json(
        {
          success: false,
          message: 'Unauthorized'
        },
        { status: 401 }
      )
    };
  }

  return {
    admin,
    response: null
  };
}
