"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

type Subsidy = {
  id: number;
  nombre: string;
  descripcion: string;
  municipio: string;
  programa: string;
};


export function SearchBar({ subsidios }: { subsidios: Subsidy[] }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Subsidy[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (query.trim().length === 0) {
      setFiltered([]);
      setOpen(false);
      return;
    }

    const q = query.toLowerCase();
    const results = subsidios.filter((s) => {
      const qLower = q.toLowerCase();
      return (
        s.nombre?.toLowerCase().includes(qLower) ||
        s.municipio?.toLowerCase().includes(qLower) ||
        s.programa?.toLowerCase().includes(qLower)
      );
    });



    setFiltered(results.slice(0, 5));
    setOpen(results.length > 0);
  }, [query, subsidios]);


  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (id: number) => {
    router.push(`/subsidios/${id}`);
  };

  const handleSearchPage = () => {
    router.push(`/subsidios?query=${encodeURIComponent(query)}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto mt-6">
      <Input
        placeholder="Buscar subsidio o programa"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="rounded-lg"
      />

      {/* Dropdown */}
      {open && (
        <Card className="absolute top-full left-0 w-full mt-1 shadow-lg rounded-lg border bg-white z-50">
          {filtered.map((s) => (
            <div
              key={s.id}
              onClick={() => handleSelect(s.id)}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100 border-b last:border-none"
            >
              <p className="font-medium">{s.nombre}</p>
              <p className="text-sm text-gray-600 truncate">
                {s.descripcion}
              </p>
            </div>
          ))}

          {/* Option to search full results */}
          <div
            onClick={handleSearchPage}
            className="px-4 py-2 text-blue-600 cursor-pointer hover:bg-blue-50"
          >
            Ver todos los resultados para "{query}"
          </div>
        </Card>
      )}
    </div>
  );
}
