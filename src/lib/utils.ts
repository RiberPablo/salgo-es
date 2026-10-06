import type { Venue } from "./venues";

/* ------------------------------------------------------------------ */
/* Categorías                                                          */
/* ------------------------------------------------------------------ */

export const CATEGORIAS = [
  { slug: "discotecas", tipo: "discoteca", nombre: "Discotecas", icon: "🪩" },
  { slug: "pubs", tipo: "pub", nombre: "Pubs", icon: "🍸" },
  { slug: "tardeos", tipo: "tardeo", nombre: "Tardeos", icon: "🍹" },
  { slug: "bares", tipo: "bar", nombre: "Bares", icon: "🍺" },
] as const;

export const DIAS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

// Degradado que se usa cuando un local todavía no tiene foto
export const TIPO_GRADIENTE: Record<string, string> = {
  discoteca: "from-fuchsia-600/40 via-violet-900/40 to-zinc-900",
  pub: "from-amber-500/30 via-orange-900/30 to-zinc-900",
  tardeo: "from-orange-500/40 via-rose-900/30 to-zinc-900",
  bar: "from-sky-500/30 via-indigo-900/30 to-zinc-900",
};

export function tipoInfo(tipo: string | null | undefined) {
  const t = (tipo ?? "").toLowerCase();
  return CATEGORIAS.find((c) => c.tipo === t);
}

// Hora de inicio (0-23) de una fecha "YYYY-MM-DDTHH:MM..." guardada tal
// cual, sin conversiones de zona horaria.
function horaDe(fecha: string | null | undefined): number | null {
  const m = (fecha ?? "").match(/T(\d{2}):|(?:^|\s)(\d{2}):\d{2}(?::|$)/);
  const h = m ? Number(m[1] ?? m[2]) : NaN;
  return Number.isFinite(h) ? h : null;
}

// Una tardeo empieza a mediodía o por la tarde, nunca a la 1 de la
// madrugada: 00:00-11:59 es "sigue siendo de madrugada/mañana", no tardeo.
function esHoraDeTardeo(hora: number | null): boolean {
  return hora !== null && hora >= 12 && hora < 21;
}

// Solo el tipo "de verdad" del local (lo que es), sin deducir nada de sus
// horarios. Esto es lo que se muestra como insignia de tipo en las tarjetas.
export function tiposPrincipales(
  v: Pick<Venue, "tipo_local" | "tipos_secundarios">
): string[] {
  const todos = [v.tipo_local, ...(v.tipos_secundarios ?? [])].filter(
    Boolean
  ) as string[];
  return Array.from(new Set(todos.map((t) => t.toLowerCase())));
}

// Tipo principal + tipos secundarios + "tardeo" cuando el local tiene algún
// horario u evento que empieza por la tarde — aunque el tardeo en sí sea obra
// de una fiesta/promotor distinto, si pasa aquí cuenta. Se usa para FILTRAR
// (categoría, buscador); para mostrar insignias en una tarjeta usa
// tiposPrincipales(), que no deduce nada de los horarios.
export function venueTipos(
  v: Pick<Venue, "tipo_local" | "tipos_secundarios"> & {
    schedules?: { tipo: string | null; apertura?: string | null }[];
    events?: { fecha_inicio: string | null }[];
  }
): string[] {
  const todos = tiposPrincipales(v);

  const porHorario = (v.schedules ?? []).some(
    (h) => h.tipo === "tarde" || esHoraDeTardeo(horaDe(h.apertura))
  );
  const porEvento = (v.events ?? []).some((e) =>
    esHoraDeTardeo(horaDe(e.fecha_inicio))
  );
  if (porHorario || porEvento) todos.push("tardeo");

  return Array.from(new Set(todos));
}

// True cuando el local tiene una sesión de tardeo HOY (horario de tarde ese
// día de la semana, o un evento de hoy que empieza por la tarde). Sirve para
// mostrar "Tardeo hoy" solo cuando es verdad: Fitz hace tardeo los sábados,
// no un martes, y un martes no debe aparecer como tarde y noche.
export function tardeoHoy(
  v: {
    schedules?: {
      dia_semana: number;
      tipo: string | null;
      apertura: string | null;
    }[];
    events?: { fecha_inicio: string | null }[];
  },
  noche: { dia: number; fecha: string } = nocheActual()
): boolean {
  const porHorario = (v.schedules ?? []).some(
    (h) =>
      h.dia_semana === noche.dia &&
      (h.tipo === "tarde" || esHoraDeTardeo(horaDe(h.apertura)))
  );
  const porEvento = (v.events ?? []).some(
    (e) =>
      (e.fecha_inicio ?? "").slice(0, 10) === noche.fecha &&
      esHoraDeTardeo(horaDe(e.fecha_inicio))
  );
  return porHorario || porEvento;
}


/* ------------------------------------------------------------------ */
/* Texto y precios                                                     */
/* ------------------------------------------------------------------ */

// Quita tildes y mayúsculas: "Reggaetón" y "reggaeton" cuentan como iguales
export function norm(s: string | null | undefined): string {
  return (s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Supabase puede devolver los numeric como número o como texto: unificamos
export function num(v: number | string | null | undefined): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// null → "Consultar" (no lo sabemos), 0 → "Gratis", resto → "12€"
export function formatPrecio(v: number | string | null | undefined): string {
  const n = num(v);
  if (n === null) return "Consultar";
  if (n === 0) return "Gratis";
  return `${n}€`;
}

// Precio "desde" para filtrar: primero el rango de Google, si no la entrada
export function precioReferencia(v: Venue): number | null {
  return num(v.precio_persona_min) ?? num(v.precio_entrada);
}

// "00:00:00" → "00:00"
export function hhmm(t: string | null | undefined): string {
  return t ? t.slice(0, 5) : "";
}

/* ------------------------------------------------------------------ */
/* Edad                                                                */
/* ------------------------------------------------------------------ */

export function parseRangoEdad(
  r: string | null | undefined
): { min: number; max: number } | null {
  if (!r) return null;
  const s = r.toLowerCase();
  if (s.includes("tod")) return null; // "todas"
  const rango = s.match(/(\d+)\s*(?:-|–|a)\s*(\d+)/);
  if (rango) return { min: Number(rango[1]), max: Number(rango[2]) };
  const solo = s.match(/(\d+)/);
  if (solo) return { min: Number(solo[1]), max: 99 }; // "+25"
  return null;
}

export function aceptaEdad(r: string | null | undefined, edad: number) {
  const p = parseRangoEdad(r);
  return !p || (edad >= p.min && edad <= p.max);
}

// Texto para la insignia; null si es "todas" o no hay dato
export function edadLabel(r: string | null | undefined): string | null {
  if (!r) return null;
  return r.toLowerCase().includes("tod") ? null : r;
}

/* ------------------------------------------------------------------ */
/* Fechas (siempre hora de Madrid, da igual dónde corra el servidor)   */
/* ------------------------------------------------------------------ */

export function madridNow() {
  const f = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    weekday: "short",
  });
  const p: Record<string, string> = {};
  for (const part of f.formatToParts(new Date())) p[part.type] = part.value;
  const dow: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return {
    fecha: `${p.year}-${p.month}-${p.day}`,
    dow: dow[p.weekday] ?? 0,
    hora: Number(p.hour),
  };
}

// "Esta noche": de madrugada (antes de las 7) seguimos contando la noche de ayer
export function nocheActual(): { dia: number; fecha: string } {
  const n = madridNow();
  if (n.hora < 7) {
    const ayer = new Date(
      Date.UTC(
        Number(n.fecha.slice(0, 4)),
        Number(n.fecha.slice(5, 7)) - 1,
        Number(n.fecha.slice(8, 10)) - 1
      )
    );
    return { dia: (n.dow + 6) % 7, fecha: ayer.toISOString().slice(0, 10) };
  }
  return { dia: n.dow, fecha: n.fecha };
}

// Dia de la semana (0=domingo...6=sabado, igual que dia_semana en BD)
// a partir de una fecha "YYYY-MM-DD..." guardada tal cual, sin lios de zona horaria.
function diaSemanaDe(fecha: string | null | undefined): number | null {
  const m = (fecha ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return new Date(
    Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  ).getUTCDay();
}

// Abre ese día de la semana, ya sea por horario fijo o porque tiene algún
// evento puntual que cae en ese día (ej. una fiesta como LaVainaBailable,
// que no tiene horario fijo pero siempre publica sus fechas en sábado).
export function abreEnDia(v: Venue, dia: number): boolean {
  const porHorario = (v.schedules ?? []).some((s) => s.dia_semana === dia);
  const porEvento = (v.events ?? []).some(
    (e) => diaSemanaDe(e.fecha_inicio) === dia
  );
  return porHorario || porEvento;
}

// Abre esta noche por horario semanal, o tiene un evento puntual hoy
export function abreHoy(
  v: Venue,
  noche: { dia: number; fecha: string } = nocheActual()
): boolean {
  const porHorario = abreEnDia(v, noche.dia);
  const porEvento = (v.events ?? []).some(
    (e) => e.fecha_inicio?.slice(0, 10) === noche.fecha
  );
  return porHorario || porEvento;
}

// Las fechas de events se guardan como hora local de Madrid sin zona horaria.
// Las leemos "a mano" para que se vean igual en cualquier servidor.
function parseWall(s: string): Date | null {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
  if (!m) return null;
  return new Date(
    Date.UTC(
      Number(m[1]),
      Number(m[2]) - 1,
      Number(m[3]),
      Number(m[4]),
      Number(m[5])
    )
  );
}

const FECHA_LARGA = new Intl.DateTimeFormat("es-ES", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
const FECHA_CORTA = new Intl.DateTimeFormat("es-ES", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const HORA = new Intl.DateTimeFormat("es-ES", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

export function formatFecha(s: string | null | undefined, corta = false) {
  const d = s ? parseWall(s) : null;
  return d ? (corta ? FECHA_CORTA : FECHA_LARGA).format(d) : "";
}

export function formatHora(s: string | null | undefined) {
  const d = s ? parseWall(s) : null;
  return d ? HORA.format(d) : "";
}

/* ------------------------------------------------------------------ */
/* Fotos                                                               */
/* ------------------------------------------------------------------ */

export function venueFoto(v: Venue): string | null {
  const fotos = v.photos ?? [];
  return fotos.find((p) => p.is_main)?.image_url ?? fotos[0]?.image_url ?? null;
}

/* ------------------------------------------------------------------ */
/* Horarios                                                            */
/* ------------------------------------------------------------------ */

export const TIPO_HORARIO_LABEL: Record<string, string> = {
  tarde: "Tardeo",
  noche: "Noche",
};

// Agrupa los horarios por tipo (tardeo/noche) y ordena cada grupo de
// lunes a domingo (en BD 0 = domingo, así que lo llevamos al final).
const DIA_CORTO: Record<number, string> = {
  0: "Dom",
  1: "Lun",
  2: "Mar",
  3: "Mié",
  4: "Jue",
  5: "Vie",
  6: "Sáb",
};

const ORDEN_SEMANA = (dia: number) => (dia + 6) % 7; // lunes=0 ... domingo=6

// Une días seguidos con la misma franja horaria en un solo bloque, para no
// repetir "00:00 - 06:00" siete veces cuando el horario es igual toda la
// semana. "Lun, Mar, Mié" con la misma hora -> un bloque "Lun - Mié".
export function compactarHorarios(
  horarios: { dia_semana: number; apertura: string | null; cierre: string | null }[]
) {
  const ordenados = [...horarios].sort(
    (a, b) => ORDEN_SEMANA(a.dia_semana) - ORDEN_SEMANA(b.dia_semana)
  );

  const bloques: {
    dias: number[];
    apertura: string | null;
    cierre: string | null;
  }[] = [];

  for (const h of ordenados) {
    const ultimo = bloques[bloques.length - 1];
    const mismaFranja =
      !!ultimo && ultimo.apertura === h.apertura && ultimo.cierre === h.cierre;
    const esConsecutivo =
      !!ultimo &&
      ORDEN_SEMANA(h.dia_semana) ===
        ORDEN_SEMANA(ultimo.dias[ultimo.dias.length - 1]) + 1;

    if (ultimo && mismaFranja && esConsecutivo) {
      ultimo.dias.push(h.dia_semana);
    } else {
      bloques.push({ dias: [h.dia_semana], apertura: h.apertura, cierre: h.cierre });
    }
  }

  return bloques.map((b) => ({
    etiqueta:
      b.dias.length === 1
        ? DIA_CORTO[b.dias[0]]
        : `${DIA_CORTO[b.dias[0]]} - ${DIA_CORTO[b.dias[b.dias.length - 1]]}`,
    apertura: b.apertura,
    cierre: b.cierre,
  }));
}

export function agruparHorarios(
  schedules: { dia_semana: number; apertura: string | null; cierre: string | null; tipo: string | null }[]
) {
  const grupos = new Map<string, typeof schedules>();

  for (const h of schedules) {
    const tipo = h.tipo ?? "noche";
    if (!grupos.has(tipo)) grupos.set(tipo, []);
    grupos.get(tipo)!.push(h);
  }

  // "noche" siempre primero (el caso más común), luego el resto alfabético
  const tipos = Array.from(grupos.keys()).sort((a, b) => {
    if (a === "noche") return -1;
    if (b === "noche") return 1;
    return a.localeCompare(b, "es");
  });

  return tipos.map((tipo) => ({
    tipo,
    label: TIPO_HORARIO_LABEL[tipo] ?? tipo,
    horarios: compactarHorarios(grupos.get(tipo)!),
  }));
}
