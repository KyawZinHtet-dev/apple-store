import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db/db_connection";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { users } from "@/db/models/user";
import { accounts } from "@/db/models/account";
import { loginSchema } from "./types/login-schema";
import Stripe from "stripe";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET!,
  callbacks: {
    jwt: async ({ token }) => {
      if (!token.sub) return token;
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub),
      });
      if (!existingUser) return token;
      const existingAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, existingUser.id),
      });

      token.isOauth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      return token;
    },
    session: async ({ session, token }) => {
      if (session && token.sub) {
        session.user.id = token.sub;
      }
      if (session && token.role) {
        session.user.role = token.role as string;
      }
      if (session) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.isOauth = token.isOauth as boolean;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      return session;
    },
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // check if credentials are valid
        const validatedCredentials = loginSchema.safeParse(credentials);
        // if credentials are valid
        if (validatedCredentials.success) {
          // check if user exists
          const { email, password } = validatedCredentials.data;
          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });
          // if user does not exist
          if (!user) {
            return null;
          }
          // if user exists
          // check if password is correct
          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password!
          );
          // if password is not correct
          if (!isPasswordCorrect) {
            return null;
          }
          // if password is correct
          return user;
        }
        // if credentials are not valid
        return null;
      },
    }),
  ],
  events: {
    createUser: async ({ user }) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-02-24.acacia",
      });
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name!,
      });
      await db
        .update(users)
        .set({ customerId: customer.id })
        .where(eq(users.id, user.id!));
    },
  },
});
