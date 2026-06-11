import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { dbConnect } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password.");
        }

        const adminEmail = "admin@interviewsaceai.online";
        const adminPassword = "AdminSecurePassword2026!";
        if (credentials.email.toLowerCase() === adminEmail && credentials.password === adminPassword) {
          return {
            id: "admin-id-12345",
            name: "Platform Admin",
            email: adminEmail,
            role: "admin",
            subscription: {
              plan: "premium",
              status: "active"
            }
          };
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user || !user.password) {
          throw new Error("No user found with this email.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Incorrect password.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          subscription: user.subscription,
        };
      },
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        if (account && account.provider === "google") {
          try {
            await dbConnect();
            let existingUser = await User.findOne({ email: user.email?.toLowerCase() });

            if (!existingUser) {
              existingUser = await User.create({
                name: user.name,
                email: user.email?.toLowerCase(),
                image: user.image || "",
                role: "user",
                subscription: {
                  plan: "free",
                  status: "inactive",
                },
              });
            }

            token.id = existingUser._id.toString();
            token.role = existingUser.role;
            token.subscription = existingUser.subscription;
          } catch (error) {
            console.error("Error linking Google user in JWT callback:", error);
          }
        } else {
          // Credentials login (user object already has these fields from authorize)
          token.id = user.id;
          token.role = (user as any).role;
          token.subscription = (user as any).subscription;
        }
      }
      
      // Handle session updates (e.g. subscribing to premium)
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }
      
      // Proactively sync subscription status on check
      if (token.id && token.id !== "admin-id-12345") {
        try {
          await dbConnect();
          const dbUser = await User.findById(token.id).select("subscription role");
          if (dbUser) {
            token.role = dbUser.role;
            token.subscription = dbUser.subscription;
          }
        } catch (e) {
          console.error("Error fetching user data in JWT callback:", e);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).subscription = token.subscription;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET || "interviewace-ai-development-secret-1234567890",
};
