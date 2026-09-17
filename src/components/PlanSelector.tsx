"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIAS = [
  {
    icon: "🪩",
    name: "Discotecas",
    tipo: "discoteca",
    vibe: "Baila hasta que salga el sol",
  },
  {
    icon: "🍸",
    name: "Pubs",
    tipo: "pub",
    vibe: "Ambiente tranquilo, buena conversación",
  },
  {
    icon: "🍹",
    name: "Tardeos",
    tipo: "tardeo",
    vibe: "Empieza pronto, sin resaca al día siguiente",
  },
  {
    icon: "🍺",
    name: "Bares",
    tipo: "bar",
    vibe: "Unas copas con calma",
  },
];

// Mismo cálculo que en venues.ts pero en el navegador: día de la semana
// (0 domingo ... 6 sábado) según la hora local del usuario.
function getDayOfWeek(): number {
  return new Date().getDay();
}

type PlanSelectorProps = {
  counts: Record<string, number>;
};

export function PlanSelector({ counts }: PlanSelectorProps) {
  const router = useRouter();
  const hoy = getDayOfWeek();

  // Nombres de día reales en vez de relativos ("mañana" es confuso: un jueves
  // "mañana" es viernes pero no lo dice). Si "Hoy" coincide con uno de los
  // días fuertes, no lo repetimos dos veces.
  const opcionesDia = [
    { label: "Hoy", valor: hoy },
    { label: "Viernes", valor: 5 },
    { label: "Sábado", valor: 6 },
    { label: "Domingo", valor: 0 },
  ].filter(
    (d, i, arr) => arr.findIndex((x) => x.valor === d.valor) === i
  );

  const [diaElegido, setDiaElegido] = useState<number | null>(null);

  function irACategoria(tipo: string) {
    const params = new URLSearchParams();
    params.set("tipo", tipo);
    if (diaElegido != null) params.set("dia", diaElegido.toString());
    router.push(`/buscar?${params.toString()}`);
  }

  return (
    <div>
      <p className="mb-3 text-sm text-zinc-500">
        ¿Para cuándo lo estás pensando?{" "}
        <span className="text-zinc-600">(opcional)</span>
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {opcionesDia.map((d) => (
          <button
            key={d.label}
            type="button"
            onClick={() =>
              setDiaElegido(diaElegido === d.valor ? null : d.valor)
            }
            className={`rounded-full border px-4 py-2 text-sm transition ${
              diaElegido === d.valor
                ? "border-lime-400 bg-lime-400/10 text-lime-300"
                : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-lime-400/40 hover:text-white"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat.tipo}
            type="button"
            onClick={() => irACategoria(cat.tipo)}
            className="group rounded-3xl border border-white/5 bg-zinc-900 p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-lime-400/40 hover:bg-zinc-800"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-2xl transition group-hover:bg-lime-400">
              {cat.icon}
            </div>

            <h3 className="mt-8 text-lg font-bold">{cat.name}</h3>

            <p className="mt-1 text-sm text-zinc-500">{cat.vibe}</p>

            <p className="mt-2 text-xs text-zinc-600">
              {counts[cat.tipo] ?? 0} sitios
            </p>

            <div className="mt-4 text-lime-400">→</div>
          </button>
        ))}
      </div>
    </div>
  );
}
