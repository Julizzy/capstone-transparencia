"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { HandCoins, Building } from "lucide-react";

export function InfoCards() {
  const router = useRouter();

  const cards = [
    {
      title: "Subsidios",
      description:
        "Encuentra información detallada sobre distintos tipos de subsidios.",
      icon: <HandCoins className="w-10 h-10 text-[#8030eb]" />,
      path: "/subsidios",
    },
    {
      title: "Programas",
      description:
        "Consulta información sobre programas sociales del Estado.",
      icon: <Building className="w-10 h-10 text-[#8030eb]" />,
      path: "/programas",
    },
  ];

  const handleClick = (path: string) => router.push(path);

  return (
    <section className="mt-20 px-6 md:px-16 text-center">
      <h3 className="text-3xl font-extrabold mb-8 text-[#5111a6]">
        ¿Qué puedes encontrar aquí?
      </h3>

      {/* 🟣 Contenedor horizontal centrado */}
      <div className="flex justify-center">
        <div className="flex gap-6 overflow-x- px-6 pb-4 justify-center w-full max-w-5xl">
          {cards.map((card, index) => (
            <Card
              key={index}
              onClick={() => handleClick(card.path)}
              className="min-w-[260px] sm:min-w-[280px] md:min-w-[300px] flex-shrink-0 cursor-pointer border border-[#8030eb]/30 shadow-md hover:shadow-lg transition-transform hover:scale-[1.03] hover:border-[#5111a6]/70 rounded-2xl bg-white"
            >
              <CardHeader className="flex flex-col items-center text-center py-8">
                <div className="flex justify-center mb-3">{card.icon}</div>
                <CardTitle className="text-[#5111a6] text-xl font-bold">
                  {card.title}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2 px-3">
                  {card.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
