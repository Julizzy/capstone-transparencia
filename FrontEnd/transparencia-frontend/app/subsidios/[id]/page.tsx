"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Chatbot from "@/components/Chatbot";


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
  const [filterText, setFilterText] = useState("");
  const [limit, setLimit] = useState(100); 
  const [analisisTexto, setAnalisisTexto] = useState({
  resumen: "",
  tendencias: "",
  hallazgos: "",
  recomendaciones: "",
});


  useEffect(() => {
    const fetchSubsidios = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/datasets/h2yr-zfb2?limit=5000&offset=0");
        const result = await res.json();
        setData(result.datos || []);
        setPromedios(result.analisis?.promedios_por_departamento || []);

        const resAnalisis = await fetch("http://127.0.0.1:8000/api/analysis/h2yr-zfb2");
        const dataAnalisis = await resAnalisis.json();
        let cleaned = dataAnalisis.respuesta
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

        const parsed = JSON.parse(cleaned);

        const analisis = parsed.analisis_dataset;

        setAnalisisTexto({
        resumen: analisis.resumen_ejecutivo?.descripcion || "",
        tendencias: analisis.tendencias_principales?.nota_muestra || "",
        hallazgos: analisis.hallazgos_importantes || "",
        recomendaciones:
          analisis.recomendaciones?.sugerencias_uso?.join(", ") || ""
        });
      } catch (error) {
        console.error("Error fetching data:", error);
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

  
  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="border border-[#5111a6]/30 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-[#5111a6]">
            Subsidios de Vivienda Asignados
          </CardTitle>
        </CardHeader>

        <CardContent>
          {analisisTexto && (
            <div className="mb-6 p-4 bg-purple-50 border-l-4 border-[#5111a6] rounded-lg shadow-sm">

              <h2 className="text-xl font-bold text-[#5111a6] mb-2">
                Análisis del Dataset
              </h2>

              {analisisTexto.resumen && (
                <p className="text-gray-700 mb-3">
                  <strong>Resumen:</strong> {analisisTexto.resumen}
                </p>
              )}
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
            <input
              type="text"
              placeholder="Filtrar por cualquier campo..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full sm:w-1/2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5111a6]"
            />

            <div className="flex items-center gap-2">
              <label htmlFor="limit" className="text-sm text-gray-600">
                Filas a mostrar:
              </label>
              <select
                id="limit"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#5111a6]"
              >
                {[50, 100, 200, 500].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-[#5111a6] mb-2">
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
                {filteredData.slice(0, limit).map((row, i) => (
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
      <Chatbot datasetId={"h2yr-zfb2"} />
    </div>
  );
}
