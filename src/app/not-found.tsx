"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-[#c8a951]">404</h1>
        <p className="text-xl text-gray-300">Page not found</p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-3 bg-[#c8a951] text-[#0a1628] font-semibold rounded-lg hover:bg-[#b8993f] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
