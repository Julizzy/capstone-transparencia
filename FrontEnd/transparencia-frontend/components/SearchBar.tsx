"use client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";


export function SearchBar() {
  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-center text-[#8030eb]">
        Accede fácilmente a información sobre subsidios y programas del Estado
      </h2>
      <div className="flex w-full mt-4">
        <Input
          placeholder="Buscar subsidio o programa"
          className="rounded-l-lg border-[#54bec7] -0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button className="rounded-l-none bg-[#0197cb] hover:bg-[#54bec7] text-white">
          Buscar
        </Button>
      </div>
    </div>
  );
}

