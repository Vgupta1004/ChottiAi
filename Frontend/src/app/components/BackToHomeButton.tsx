"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BackToHomeButton() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  let colorClass = "bg-blue-600 hover:bg-blue-700 border-blue-700";
  if (pathname.startsWith("/noticeboard")) {
    colorClass = "bg-orange-500 hover:bg-orange-600 border-orange-600";
  } else if (pathname.startsWith("/shopping")) {
    colorClass = "bg-violet-600 hover:bg-violet-700 border-violet-700";
  } else if (pathname.startsWith("/chatbot")) {
    colorClass = "bg-blue-600 hover:bg-blue-700 border-blue-700";
  }

  return (
    <div className="w-full flex justify-start mt-12 mb-4 ml-4">
      <Link
        href="/"
        className={`inline-block px-6 py-2 rounded-full font-bold shadow-lg transition-all text-base tracking-wide border-2 ${colorClass} text-white`}
        style={{letterSpacing: '0.04em'}}
      >
        ← Back to Home
      </Link>
    </div>
  );
} 