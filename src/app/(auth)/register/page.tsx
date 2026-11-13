"use client";

import React from "react";
import { RegisterForm } from "@/features/auth";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
      <RegisterForm />
    </div>
  );
}
