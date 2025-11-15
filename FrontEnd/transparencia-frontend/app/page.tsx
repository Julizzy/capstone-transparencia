"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { InfoCards } from "@/components/InfoCards";


type Subsidy = {
  id: number;
  nombre: string;
  descripcion: string;
  municipio: string;
  programa: string;
};
export default function Home() {
  const [subsidios, setSubsidios] = useState<Subsidy[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/datasets/metadata")
      .then((res) => res.json())
      .then((data) => {
        const preview = data.preview || [];

        // Convert preview dataset into Subsidy[]
        const mapped = preview.map((item: any, index: number) => ({
          id: index + 1,
          nombre: item.programa || item.titulo || "Sin nombre",
          descripcion: item.descripcion || item.programa || "Sin descripción",
          municipio: item.municipio || "",
          programa: item.programa || "",
        }));

        setSubsidios(mapped);
      });

  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto p-6">
        <SearchBar subsidios={subsidios} />
        <InfoCards />
      </div>
    </main>
  );
}
