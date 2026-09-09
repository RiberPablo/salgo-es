"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TIPOS = [
  { value: "", label: "Todos los sitios" },
  { value: "discoteca", label: "Discotecas" },
  { value: "pub", label: "Pubs" },
  { value: "tardeo", label: "Tardeos" },
  { value: "bar", label: "Bares" },
];

export function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState("");
  const [tipoAbierto, setTipoAbierto] = useState(false);

  function handleExplorar() {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (tipo) params.set("tipo", tipo);
    router.push(`/buscar?${params.toString()}`);
  }

  return (
    <div className="mt-10 max-w-5xl rounded-3xl border border-white/10 bg-zinc-900/70 p-3 shadow-2xl backdrop-blur">
      <div className="grid gap-2 md:grid-cols-[1.5fr_1fr_1fr_auto]">

        <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] px-5 py-4">
          <span className="text-xl">🔎</span>

          <div className="flex flex-1 flex-col">
            <span className="text-xs text-zinc-500">Buscar</span>

            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleExplorar()}
              placeholder="Local, ciudad o zona"
              className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-zinc-600"
            />
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-3 rounded-2xl px-5 py-4 text-left transition hover:bg-white/[0.04]"
        >
          <span className="text-xl">📍</span>
          <div>
            <p className="text-xs text-zinc-500">Ubicación</p>
            <p className="text-sm font-medium">Cerca de mí</p>
          </div>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setTipoAbierto((v) => !v)}
            className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left transition hover:bg-white/[0.04]"
          >
            <span className="text-xl">🪩</span>
            <div>
              <p className="text-xs text-zinc-500">Tipo</p>
              <p className="text-sm font-medium">
                {TIPOS.find((t) => t.value === tipo)?.label ?? "Todos los sitios"}
              </p>
            </div>
          </button>

          {tipoAbierto && (
            <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-xl">
              {TIPOS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => {
                    setTipo(t.value);
                    setTipoAbierto(false);
                  }}
                  className="block w-full px-5 py-3 text-left text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleExplorar}
          className="rounded-2xl bg-lime-400 px-7 py-4 font-bold text-black transition hover:scale-[1.02] hover:bg-lime-300"
        >
          Explorar
        </button>

      </div>
    </div>
  );
}
