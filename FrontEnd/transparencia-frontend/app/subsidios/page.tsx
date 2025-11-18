"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";


type Subsidy = {
  id: number;
  nombre: string;
  descripcion: string;
  ciudad: string;
  edadMin: number;
  edadMax: number;
  ingresos: string;
  fuente: string;
  fechaActualizacion: string;
};

export default function SubsidiosPage() {
  const [filtros, setFiltros] = useState({ ciudad: "", edad: "", ingresos: "" });
  const [resultados, setResultados] = useState<Subsidy[]>([]);
  const [subsidios, setSubsidios] = useState<Subsidy[]>([]);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [metadata, setMetadata] = useState<any | null>(null);




 
  useEffect(() => {
    // Consumir el endpoint y mapear la respuesta
    fetch("http://127.0.0.1:8000/api/datasets/metadata")
      .then((res) => res.json())
      .then((data) => {
        const meta = data.subsidiosVivienda;
        // Puedes ajustar los valores según lo que necesites mostrar
        const subsidio: Subsidy = {
          id: 1,
          nombre: meta.titulo,
          descripcion: meta.descripcion,
          ciudad: "Nacional", // O puedes dejarlo vacío si no aplica
          edadMin: 0,
          edadMax: 99,
          ingresos: "No especificado",
          fuente: meta.fuente,
          fechaActualizacion: meta.frecuencia_actualizacion
            ? new Date(meta.frecuencia_actualizacion * 1000).toISOString().split("T")[0]
            : "",
        };
        setSubsidios([subsidio]);
        setResultados([subsidio]);
      });
    fetch("http://127.0.0.1:8000/api/metadata/h2yr-zfb2")
      .then((res) => res.json())
      .then((data) => setMetadata(data));
  }, []);

  const handleSearch = () => {
    const query = search.toLowerCase();

    const filtrados = subsidios.filter((s) => {
      return (
        s.nombre.toLowerCase().includes(query) ||
        s.ciudad.toLowerCase().includes(query) ||
        s.descripcion.toLowerCase().includes(query)
      );
    });

    setResultados(filtrados);
  };


  const handleCardClick = (id: number) => {
    router.push(`/subsidios/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#5111a6] text-center mb-6">
        Resultados de búsqueda
      </h1>

      {/* Filtros */}
      {/* Search bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Input
          placeholder="Buscar por nombre, municipio o programa"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:col-span-4"
        />

        <Input
          placeholder="Ciudad"
          value={filtros.ciudad}
          onChange={(e) => setFiltros({ ...filtros, ciudad: e.target.value })}
        />
        <Input
          placeholder="Edad"
          type="number"
          value={filtros.edad}
          onChange={(e) => setFiltros({ ...filtros, edad: e.target.value })}
        />
        <Input
          placeholder="Ingresos (ej. 2 SMMLV)"
          value={filtros.ingresos}
          onChange={(e) => setFiltros({ ...filtros, ingresos: e.target.value })}
        />
        <Button
          onClick={handleSearch}
          className="bg-[#5111a6] hover:bg-[#3d0d84]"
        >
          <Search className="w-4 h-4 mr-2" /> Filtrar
        </Button>
        
        {metadata && (
          <div className="md:col-span-4">
            <Card
          className="border border-[#5111a6]/40 mb-8 hover:shadow-xl cursor-pointer transition"
          onClick={() => router.push("/subsidios/h2yr-zfb2")}
        >
          <CardHeader>
            <CardTitle className="text-xl text-[#5111a6]">
              {metadata.titulo}
            </CardTitle>
            <CardDescription>{metadata.descripcion}</CardDescription>
          </CardHeader>

          <CardContent className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>Fuente:</strong> {metadata.fuente}
            </p>
            <p>
              <strong>Última actualización:</strong>{" "}
              {new Date(metadata.ultima_actualizacion * 1000)
                .toISOString()
                .split("T")[0]}
            </p>

            <div>
              <strong>Columnas:</strong>
              <ul className="list-disc pl-6">
                {metadata.columnas.map((col: string, i: number) => (
                  <li key={i}>{col}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
          </div>
        
      )}
      </div>

      {/* Resultados */}
      {resultados.length === 0 ? (
        <p className="text-center text-gray-600">
          No se encontraron subsidios con los filtros seleccionados.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {resultados.map((s) => (
            <Card
              key={s.id}
              onClick={() => handleCardClick(s.id)}
              className="border border-[#5111a6]/30 hover:shadow-lg cursor-pointer transition"
            >
              <CardHeader>
                <CardTitle>{s.nombre}</CardTitle>
                <CardDescription>{s.descripcion}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-700">
                <p>
                  <strong>Fuente:</strong> {s.fuente}
                </p>
                <p>
                  <strong>Última actualización:</strong>{" "}
                  {s.fechaActualizacion}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
