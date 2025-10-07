"use client";
import { Button } from "@/components/ui/Button";
import Image from "next/image";


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
       <h1 className="font-bold text-2xl text-[#0197cb]">SUBSIDIOS</h1>
      </div>
      <div className="flex gap-4">
        <Button variant="ghost" className="text-[#0197cb] hover:text-[#54bec7]">
          Inicio
        </Button>
        <Button variant="ghost" className="text-[#0197cb] hover:text-[#54bec7]">
          Acerca de
        </Button>
      </div>
    </nav>
  );
}
