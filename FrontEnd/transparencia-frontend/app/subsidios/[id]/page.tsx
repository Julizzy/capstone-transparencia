"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

type Subsidio = {
  departamento?: string;
  municipio?: string;
  programa?: string;
  valor_asignado?: string;
  hogares?: string;
  [key: string]: any;
};

export default function SubsidioDataPage() {
  const [data, setData] = useState<Subsidio[]>([]);
  const [promedios, setPromedios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubsidios = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/subsidiosVivienda/");
        const result = await res.json();
        setData(result.registros || []);
        setPromedios(result.analisis?.promedios_por_departamento || []);
      } catch (error) {
        console.error("Error fetching subsidios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubsidios();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Cargando datos...</p>;
  }

  if (!data.length) {
    return (
      <p className="text-center text-red-500 mt-10">
        No se encontraron registros de subsidios.
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="border border-[#5111a6]/30 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-[#5111a6]">
            Subsidios de Vivienda Asignados
          </CardTitle>
        </CardHeader>

        <CardContent>
          <h2 className="text-xl font-semibold text-[#5111a6] mt-4 mb-2">
            Registros del dataset
          </h2>

          <div className="overflow-x-auto max-h-[600px] overflow-y-scroll border rounded-lg">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-[#f3e8ff] sticky top-0">
                <tr>
                  {Object.keys(data[0] || {}).map((col) => (
                    <th
                      key={col}
                      className="p-2 text-left text-[#5111a6] capitalize border-b"
                    >
                      {col.replace(/_/g, " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 100).map((row, i) => ( 
                  <tr key={i} className="border-b hover:bg-gray-50">
                    {Object.values(row).map((value, j) => (
                      <td key={j} className="p-2 text-gray-700 break-words">
                        {String(value ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {promedios.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-[#5111a6] mt-6 mb-2">
                Promedio del valor asignado por departamento
              </h2>
              <table className="w-full border-collapse text-sm">
                <thead className="bg-[#f3e8ff]">
                  <tr>
                    <th className="text-left p-2 text-[#5111a6] border-b">
                      Departamento
                    </th>
                    <th className="text-left p-2 text-[#5111a6] border-b">
                      Promedio Subsidio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {promedios.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2 text-gray-700">{item.departamento}</td>
                      <td className="p-2 text-gray-700">
                        {Number(item.promedio_subsidio).toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
