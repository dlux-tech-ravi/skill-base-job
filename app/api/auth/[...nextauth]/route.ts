import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        // Static admin user (does not depend on Firestore)
        if (
          credentials.email === "admin" &&
          credentials.password === "admin123"
        ) {
          return {
            id: "admin",
            name: "Admin",
            email: "admin",
            role: "admin",
          };
        }

        const usersRef = collection(db, "users");
        const snap = await getDocs(
          query(usersRef, where("email", "==", credentials.email))
        );

        if (snap.empty) {
          throw new Error("User not found");
        }

        const doc = snap.docs[0];
        const userData = doc.data() as any;

        const isValid = await bcrypt.compare(
          credentials.password,
          userData.password
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: doc.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any).role = token.role as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
