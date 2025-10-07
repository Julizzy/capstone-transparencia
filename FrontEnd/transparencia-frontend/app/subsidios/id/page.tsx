"use client";

import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

const SUBSIDIOS = [
  {
    id: 1,
    nombre: "Subsidio de Vivienda Jóvenes Propietarios",
    descripcion:
      "Programa para jóvenes entre 18 y 28 años que buscan adquirir su primera vivienda.",
    ciudad: "Bogotá",
    edadMin: 18,
    edadMax: 28,
    ingresos: "hasta 4 SMMLV",
    fuente: "https://www.minvivienda.gov.co/",
    fechaActualizacion: "2024-12-15",
  },
  {
    id: 2,
    nombre: "Ingreso Solidario",
    descripcion:
      "Apoyo económico a familias en condición de vulnerabilidad no beneficiarias de otros programas.",
    ciudad: "Medellín",
    edadMin: 18,
    edadMax: 65,
    ingresos: "hasta 2 SMMLV",
    fuente: "https://prosperidadsocial.gov.co/",
    fechaActualizacion: "2025-02-01",
  },
];

export default function SubsidioDetalle() {
  const params = useParams();
  const id = Number(params.id);

  const subsidio = SUBSIDIOS.find((s) => s.id === id);

  if (!subsidio) {
    return <p className="text-center text-gray-600 mt-10">Subsidio no encontrado.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="border border-[#5111a6]/30 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-[#5111a6] font-bold mb-2">
            {subsidio.nombre}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 space-y-3">
          <p>{subsidio.descripcion}</p>
          <p>
            <strong>Ciudad:</strong> {subsidio.ciudad}
          </p>
          <p>
            <strong>Rango de edad:</strong> {subsidio.edadMin} – {subsidio.edadMax}
          </p>
          <p>
            <strong>Ingresos:</strong> {subsidio.ingresos}
          </p>
          <p>
            <strong>Fuente oficial:</strong>{" "}
            <a
              href={subsidio.fuente}
              target="_blank"
              className="text-[#5111a6] underline"
            >
              {subsidio.fuente}
            </a>
          </p>
          <p className="text-sm text-gray-500">
            Última actualización: {subsidio.fechaActualizacion}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
