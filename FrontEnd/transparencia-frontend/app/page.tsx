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
    async function loadData() {
      const [metaRes, dataRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/datasets/metadata"),
        fetch("http://127.0.0.1:8000/api/subsidiosVivienda/")
      ]);

      const metadata = await metaRes.json();
      const data = await dataRes.json();

      const registros = data.registros || [];

      const mapped = registros.map((item: any, index: number) => ({
        id: index + 1,
        nombre: item.programa || item.titulo || "Sin nombre",

        
        descripcion:
          item.descripcion ||
          metadata.subsidiosVivienda?.descripcion ||
          "Sin descripción",

        municipio: item.municipio || item.mun || item.ciudad || "",
        programa: item.programa || "",
      }));

      setSubsidios(mapped);
    }

    loadData();
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
