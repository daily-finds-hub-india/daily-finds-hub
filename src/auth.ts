import bcrypt from 'bcryptjs';
import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { prisma } from '@/lib/prisma';
import { getClientIp } from '@/lib/security/client-ip';
import { rateLimit } from '@/lib/security/rate-limit';

const DUMMY_PASSWORD_HASH =
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

const INVALID_LOGIN_DELAY_MS = 500;

const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

const MAX_USERNAME_LENGTH = 100;
const MAX_PASSWORD_LENGTH = 256;

const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const ACCOUNT_LOCK_DURATION_MS = 10 * 60 * 1000;

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function recordFailedLogin(adminId: string) {
  const lockUntil = new Date(Date.now() + ACCOUNT_LOCK_DURATION_MS);

  await prisma.$executeRaw`
    UPDATE "AdminUser"
    SET
      "failedLoginAttempts" = "failedLoginAttempts" + 1,
      "lockedUntil" = CASE
        WHEN "failedLoginAttempts" + 1 >= ${MAX_FAILED_LOGIN_ATTEMPTS}
          THEN ${lockUntil}
        ELSE "lockedUntil"
      END,
      "updatedAt" = NOW()
    WHERE
      "id" = ${adminId}
      AND "isActive" = true
      AND (
        "lockedUntil" IS NULL
        OR "lockedUntil" <= NOW()
      )
  `;
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        username: {
          label: 'Username',
          type: 'text'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },

      async authorize(credentials, request) {
        if (
          typeof credentials?.username !== 'string' ||
          typeof credentials?.password !== 'string'
        ) {
          return null;
        }

        const username = credentials.username.trim();
        const password = credentials.password;

        if (
          username.length === 0 ||
          password.length === 0 ||
          username.length > MAX_USERNAME_LENGTH ||
          password.length > MAX_PASSWORD_LENGTH
        ) {
          await delay(INVALID_LOGIN_DELAY_MS);
          return null;
        }

        const clientIp = getClientIp(request);

        const ipRateLimit = await rateLimit({
          key: `login:ip:${clientIp}`,
          limit: 10,
          windowSeconds: 15 * 60
        });

        if (!ipRateLimit.allowed) {
          await delay(INVALID_LOGIN_DELAY_MS);
          return null;
        }

        const admin = await prisma.adminUser.findUnique({
          where: {
            username
          },
          select: {
            id: true,
            passwordHash: true,
            isActive: true,
            failedLoginAttempts: true,
            lockedUntil: true,
            sessionVersion: true
          }
        });

        const passwordHash = admin?.passwordHash ?? DUMMY_PASSWORD_HASH;

        const passwordMatches = await bcrypt.compare(password, passwordHash);

        /*
         * Reject unknown, inactive, locked, or invalid-password attempts.
         */
        if (
          !admin ||
          !admin.isActive ||
          (admin.lockedUntil && admin.lockedUntil.getTime() > Date.now()) ||
          !passwordMatches
        ) {
          if (
            admin &&
            admin.isActive &&
            !passwordMatches &&
            !(admin.lockedUntil && admin.lockedUntil.getTime() > Date.now())
          ) {
            const usernameRateLimit = await rateLimit({
              key: `login:user:${username.toLowerCase()}`,
              limit: 10,
              windowSeconds: 15 * 60
            });

            if (!usernameRateLimit.allowed) {
              await delay(INVALID_LOGIN_DELAY_MS);
              return null;
            }

            await recordFailedLogin(admin.id);
          }

          await delay(INVALID_LOGIN_DELAY_MS);
          return null;
        }

        /*
         * Successful authentication clears previous failed attempts
         * and removes any expired lock state.
         */
        await prisma.adminUser.update({
          where: {
            id: admin.id
          },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null
          }
        });

        return {
          id: admin.id,
          name: 'Admin',
          sessionVersion: admin.sessionVersion
        };
      }
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;

        if (typeof user.sessionVersion === 'number') {
          token.sessionVersion = user.sessionVersion;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;

        if (typeof token.sessionVersion === 'number') {
          session.user.sessionVersion = token.sessionVersion;
        }
      }

      return session;
    }
  },

  pages: {
    signIn: '/admin/login'
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
