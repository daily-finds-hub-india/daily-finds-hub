import bcrypt from 'bcryptjs';
import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

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

      async authorize(credentials) {
        if (
          typeof credentials?.username !== 'string' ||
          typeof credentials?.password !== 'string'
        ) {
          return null;
        }

        const username = credentials.username.trim();

        if (!username || !credentials.password) {
          return null;
        }

        const admin = await prisma.adminUser.findFirst({
          where: {
            username,
            isActive: true
          }
        });

        if (!admin) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          credentials.password,
          admin.passwordHash
        );

        if (!passwordMatches) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          return null;
        }

        return {
          id: admin.id,
          name: 'Admin'
        };
      }
    })
  ],

  session: {
    strategy: 'jwt'
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }

      return token;
    },

    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    }
  },

  pages: {
    signIn: '/admin/login'
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
