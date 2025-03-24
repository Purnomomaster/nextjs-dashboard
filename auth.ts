import NextAuth from 'next-auth';
import { JWT } from "next-auth/jwt";
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { User } from './app/lib/definitions';
import bcrypt from 'bcrypt';
const client = require('./app/lib/db');

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      // Add any other user properties
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    // Add any other token properties you need
  }
}

async function getUser(email: string): Promise<User | undefined> {
  try {
    const data = await client.query('SELECT * FROM users WHERE email=$1', [
      email,
    ]);
    if (data.rows.length === 0) {
      return undefined;
    }
    return data.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],

  callbacks: {
    // Add the JWT callback to include the user ID in the token
    jwt: async ({ token, user }) => {
      if (user) {
        // This runs when the user signs in
        token.id = user.id as string;
        // token.role = user.role; // If you have roles, you can add them too
      }
      return token;
    },
    // Add the session callback to include the user ID from the token
    session: async ({ session, token }) => {
      console.log("Session callback - token:", token); // Debugging
      if (session.user) {
        session.user.id = token.id;
        // You can add other user properties here too
        // session.user.role = token.role;
      }
      console.log("Session callback - session:", session); // Debugging
      return session;
    },
  },

});
