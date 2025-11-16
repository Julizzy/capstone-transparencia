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

type ResultWithReason = Subsidy & { matchReason: string };

export function SearchBar({ subsidios }: { subsidios: Subsidy[] }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<ResultWithReason[]>([]);
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

    
    const rawMatches = subsidios.filter((s) => {
      return (
        s.nombre?.toLowerCase().includes(q) ||
        s.municipio?.toLowerCase().includes(q) ||
        s.programa?.toLowerCase().includes(q)
      );
    });

    
    const withReasons: ResultWithReason[] = rawMatches.map((s) => {
      let reason = "";
      if (s.nombre?.toLowerCase().includes(q)) reason = "Nombre";
      else if (s.municipio?.toLowerCase().includes(q)) reason = "Municipio";
      else if (s.programa?.toLowerCase().includes(q)) reason = "Programa";

      return { ...s, matchReason: reason };
    });

    setFiltered(withReasons.slice(0, 5));
    setOpen(withReasons.length > 0);
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

      {open && (
        <Card className="absolute top-full left-0 w-full mt-1 shadow-lg rounded-lg border bg-white z-50">
          {filtered.map((s) => (
            <div
              key={s.id}
              onClick={() => handleSelect(s.id)}
              className="px-4 py-3 cursor-pointer hover:bg-blue-100 border-b last:border-none"
            >
              <p className="font-medium">{s.nombre}</p>
              <p className="text-sm text-gray-600 truncate">{s.descripcion}</p>

              
              <p className="text-xs text-gray-500 mt-1">
                Coincidencia: <span className="font-semibold">{s.matchReason}</span>
              </p>
            </div>
          ))}

          <div
            onClick={handleSearchPage}
            className="px-4 py-2 text-blue-600 cursor-pointer hover:bg-blue-50 text-sm font-medium"
          >
            Ver todos los resultados para "{query}"
          </div>
        </Card>
      )}
    </div>
  );
}
