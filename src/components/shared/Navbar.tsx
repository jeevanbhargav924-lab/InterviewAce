"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "./Providers";
import { FREE_BETA } from "@/lib/config";
import SearchOverlay from "./SearchOverlay";
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  User, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Compass, 
  Cpu, 
  Terminal, 
  FileText, 
  BookOpen,
  Search
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigation = [
    { name: "Prepare", href: "/prepare", icon: Compass },
    { name: "AI Mock", href: "/mock-interview", icon: Cpu },
    { name: "Coding", href: "/coding", icon: Terminal },
    { name: "Resume ATS", href: "/resume-analyzer", icon: FileText },
    { name: "Blog", href: "/blog", icon: BookOpen },
  ];

  const isActive = (path: string) => pathname === path;
  const isAdmin = (session?.user as any)?.role === "admin";
  
  const hasPremiumRecord = (session?.user as any)?.subscription?.plan === "premium" && 
                          (session?.user as any)?.subscription?.status === "active";
  const isPremium = FREE_BETA || hasPremiumRecord;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/10 bg-slate-900/60 dark:bg-[#030014]/60 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-purple to-brand-cyan text-white font-black text-lg shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                A
              </span>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                InterviewAce<span className="text-brand-cyan">.AI</span>
              </span>
              {FREE_BETA ? (
                <span className="inline-flex items-center rounded-full bg-brand-purple/15 px-2.5 py-0.5 text-xs font-semibold text-brand-purple border border-brand-purple/20 animate-pulse">
                  BETA
                </span>
              ) : hasPremiumRecord && (
                <span className="inline-flex items-center rounded-full bg-brand-cyan/15 px-2.5 py-0.5 text-xs font-semibold text-brand-cyan border border-brand-cyan/20 animate-pulse">
                  PRO
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1.5 text-sm font-medium transition-colors duration-200 hover:text-brand-cyan ${
                    isActive(item.href) 
                      ? "text-brand-cyan" 
                      : "text-slate-300 dark:text-slate-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Header Options */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Trigger Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center space-x-2 text-slate-400 bg-slate-950 hover:bg-slate-900 border border-slate-800/80 rounded-lg px-3 py-1.5 text-xs transition-all w-36 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-purple"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="flex-1 truncate">Search prep...</span>
              <kbd className="hidden xl:inline-block font-mono text-[9px] bg-slate-800 border border-slate-700 rounded px-1 text-slate-500">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-all"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-400" />}
            </button>

            {/* Auth Dropdown / Buttons */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 rounded-full border border-slate-700 bg-slate-800/80 p-1 pr-3 hover:border-brand-purple hover:bg-slate-800 transition-all focus:outline-none"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center text-white text-xs font-bold uppercase overflow-hidden">
                    {session.user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={session.user.image} alt={session.user.name || "User"} className="h-full w-full object-cover" />
                    ) : (
                      session.user?.name?.substring(0, 2) || "US"
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 max-w-[80px] truncate">
                    {session.user?.name}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-700/80 bg-slate-900/95 p-1 shadow-xl backdrop-blur-md z-50">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <hr className="my-1 border-slate-700/50" />
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan px-4 py-2 text-sm font-semibold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5 transition-all"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5 transition-all"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 dark:bg-[#030014] px-4 py-3 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-base font-medium ${
                  isActive(item.href)
                    ? "bg-slate-800 text-brand-cyan"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <hr className="border-slate-800 my-2" />
          {session ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-white/5"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-white/5"
                >
                  <Settings className="h-5 w-5" />
                  <span>Admin Panel</span>
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-base font-medium text-red-400 hover:bg-red-500/10 text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-lg border border-slate-700 py-2.5 text-center text-sm font-semibold text-slate-300"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan py-2.5 text-center text-sm font-semibold text-white shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
}
