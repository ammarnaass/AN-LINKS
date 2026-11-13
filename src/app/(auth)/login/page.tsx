"use client";

import React from "react";
import Link from "next/link";
import { Link2 } from "lucide-react";
import { LoginForm, AuthSideBanner } from "@/features/auth";
import { ThemeToggle } from "@/shared/ui";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface" dir="rtl">
      {/* Top Bar */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-md">
            <Link2 className="w-4 h-4 rotate-45" />
          </div>
          <span className="font-bold text-base text-on-surface group-hover:text-primary transition-colors">
            روابط | Rawabet
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Split Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 w-full items-center">
          <div className="flex justify-center lg:justify-end">
            <LoginForm />
          </div>
          <AuthSideBanner />
        </div>
      </div>
    </div>
  );
}
