import NextAuth, { type DefaultSession } from "next-auth";
export type ExtendedSession = DefaultSession["user"] & {
  id: string;
  role: string;
  isTwoFactorEnabled: boolean;
  isOauth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedSession;
  }
}
