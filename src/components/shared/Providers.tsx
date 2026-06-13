"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SessionProvider as NextAuthSessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark"); // Default to premium dark theme

  useEffect(() => {
    // Check local storage or system preferences on mount
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [firebaseLoading, setFirebaseLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setFirebaseLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (status === "loading" || firebaseLoading) return;

    const protectedRoutes = ["/dashboard", "/resume-analyzer", "/prepare", "/mock-interview", "/admin"];
    const isProtected = protectedRoutes.some(route => pathname === route || pathname.startsWith(route + "/"));

    const authRoutes = ["/login", "/register", "/signup"];
    const isAuthRoute = authRoutes.includes(pathname);

    // 1. Authenticated in NextAuth (Verified)
    if (status === "authenticated") {
      if (isAuthRoute || pathname === "/verify-email") {
        router.push("/");
      }
    } 
    // 2. Unauthenticated in NextAuth
    else if (status === "unauthenticated") {
      if (firebaseUser && !firebaseUser.emailVerified) {
        // User logged in to Firebase but unverified -> redirect to verify-email
        if (pathname !== "/verify-email") {
          router.push("/verify-email");
        }
      } else {
        // Completely unauthenticated -> redirect to login
        if (isProtected) {
          router.push("/login");
        }
      }
    }
  }, [session, status, firebaseUser, firebaseLoading, pathname, router]);

  const protectedRoutes = ["/dashboard", "/resume-analyzer", "/prepare", "/mock-interview", "/admin"];
  const isProtected = protectedRoutes.some(route => pathname === route || pathname.startsWith(route + "/"));

  if (isProtected && (status === "loading" || firebaseLoading || status === "unauthenticated")) {
    return (
      <div className="min-h-screen bg-[#030014] text-slate-500 flex items-center justify-center text-xs animate-pulse">
        Verifying user credentials...
      </div>
    );
  }

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <RouteGuard>
        <ThemeProvider>{children}</ThemeProvider>
      </RouteGuard>
    </NextAuthSessionProvider>
  );
}
