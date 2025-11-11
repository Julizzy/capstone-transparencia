"use client";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { Home, Info } from "lucide-react";

export function Navbar() {
  return (
    <nav className="flex justify-between items-center py-0.5 px-11 bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <Image
          src="/logo1.png"
          alt="Logo de Subsidios"
          width={90}
          height={90}
        />
        <h1 className="font-bold text-2xl text-[#0197cb]">GovLens</h1>
      </div>

      <div className="flex gap-4">
        <Link href="/" className="flex items-center gap-2 text-[#0197cb] hover:text-[#54bec7]">
          <Home className="w-4 h-4" />
          Inicio
        </Link>

        <Link href="/acerca" className="flex items-center gap-2 text-[#0197cb] hover:text-[#54bec7]">
          <Info className="w-4 h-4" />
          Acerca de
        </Link>
      </div>
    </nav>
  );
}
