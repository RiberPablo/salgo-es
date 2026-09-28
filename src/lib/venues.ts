import { supabase } from "./supabase";
import {
  abreEnDia,
  abreHoy,
  aceptaEdad,
  madridNow,
  norm,
  nocheActual,
  num,
  precioReferencia,
  venueTipos,
} from "./utils";

export type Fiesta = {
  id: string;
  nombre: string;
  descripcion: string | null;
  instagram: string | null;
  web: string | null;
  logo_url: string | null;
};

export type VenueEvent = {
  id: string;
  nombre: string | null;
  descripcion: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  precio_desde: number | null;
  foto_url: string | null;
  entrada_url: string | null;
  fiestas: Fiesta | null;
};

export type EventoDetalle = VenueEvent & {
  venues: {
    id: string;
    nombre: string;
    direccion: string | null;
    zones: { nombre: string } | null;
    cities: { nombre: string } | null;
  } | null;
};

export type EventoConLocal = VenueEvent & {
  venues: { id: string; nombre: string; zones: { nombre: string } | null } | null;
};

export type Venue = {
  id: string;
  nombre: string;
  descripcion: string | null;
  direccion: string | null;
  tipo_local: string | null;
  tipos_secundarios: string[] | null;
  precio_entrada: number | null;
  precio_copa: number | null;
  precio_medio: number | null;
  precio_persona_min: number | null;
  precio_persona_max: number | null;
  instagram: string | null;
  web: string | null;
  rango_edad: string | null;
  vestimenta: string | null;
  zones: { nombre: string } | null;
  cities: { nombre: string } | null;
  photos: { image_url: string; is_main: boolean }[];
  venue_genres: { genres: { nombre: string } | null }[];
  schedules?: {
    dia_semana: number;
    apertura: string | null;
    cierre: string | null;
    tipo: string | null;
  }[];
  events?: VenueEvent[];
};

const VENUE_SELECT = `
  id, nombre, descripcion, direccion, tipo_local, tipos_secundarios,
  precio_entrada, precio_copa, precio_medio,
  precio_persona_min, precio_persona_max,
  instagram, web,
  rango_edad, vestimenta,
  zones ( nombre ),
  cities ( nombre ),
  photos ( image_url, is_main ),
  venue_genres ( genres ( nombre ) ),
  schedules ( dia_semana, apertura, cierre, tipo ),
  events ( id, nombre, descripcion, fecha_inicio, fecha_fin, precio_desde, foto_url, entrada_url, fiestas ( id, nombre, descripcion, instagram, web, logo_url ) )
`;

/* ------------------------------------------------------------------ */
/* Consultas básicas                                                   */
/* ------------------------------------------------------------------ */

export async function getVenues(): Promise<Venue[]> {
  const { data, error } = await supabase
    .from("venues")
    .select(VENUE_SELECT)
    .eq("activo", true)
    .order("nombre");

  if (error) {
    console.error("Error cargando locales:", error.message);
    return [];
  }

  return data as unknown as Venue[];
}

export async function getVenueById(id: string): Promise<Venue | null> {
  const { data, error } = await supabase
    .from("venues")
    .select(VENUE_SELECT)
    .eq("id", id)
    .eq("activo", true)
    .single();

  if (error) {
    console.error("Error cargando el local:", error.message);
    return null;
  }

  return data as unknown as Venue;
}

// tipoLocal en singular, como en BD: 'discoteca', 'pub', 'tardeo', 'bar'.
// Incluye los locales que lo tienen como tipo secundario.
export async function getVenuesByTipo(tipoLocal: string): Promise<Venue[]> {
  const todos = await getVenues();
  const t = tipoLocal.toLowerCase();
  return todos.filter((v) => venueTipos(v).includes(t));
}

// Eventos puntuales de hoy en adelante, de cualquier local.
// limit es opcional: sin él, trae todos los que haya.
export async function getUpcomingEvents(
  limit?: number
): Promise<EventoConLocal[]> {
  let query = supabase
    .from("events")
    .select(
      "id, nombre, descripcion, fecha_inicio, fecha_fin, precio_desde, foto_url, entrada_url, fiestas ( id, nombre, descripcion, instagram, web, logo_url ), venues ( id, nombre, zones ( nombre ) )"
    )
    .gte("fecha_inicio", `${madridNow().fecha}T00:00:00`)
    .order("fecha_inicio");

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error cargando eventos:", error.message);
    return [];
  }

  return data as unknown as EventoConLocal[];
}

/* ------------------------------------------------------------------ */
/* Filtros de búsqueda                                                 */
/* ------------------------------------------------------------------ */

export type Filtros = {
  q?: string; // texto libre: nombre, dirección, zona o ciudad
  tipo?: string; // discoteca | pub | tardeo | bar
  genero?: string; // nombre del género, ej. "Reggaetón"
  zona?: string;
  ciudad?: string;
  edad?: string; // edad de la persona: filtra locales que la admiten
  precio?: string; // "gratis" o el máximo, ej. "20"
  vestimenta?: string;
  cuando?: string; // "hoy" o día de la semana 0-6 (0 = domingo)
};

export const FILTRO_KEYS: (keyof Filtros)[] = [
  "q",
  "tipo",
  "genero",
  "zona",
  "ciudad",
  "edad",
  "precio",
  "vestimenta",
  "cuando",
];

export function filtrarLocales(
  todos: Venue[],
  f: Filtros
): { resultados: Venue[]; ocultosPorPrecio: number } {
  const noche = nocheActual();
  const q = norm(f.q);
  const edad = f.edad ? Number(f.edad) : NaN;

  let lista = todos.filter((v) => {
    if (q) {
      const texto = norm(
        [v.nombre, v.direccion, v.zones?.nombre, v.cities?.nombre].join(" ")
      );
      if (!texto.includes(q)) return false;
    }

    if (f.tipo && !venueTipos(v).includes(f.tipo.toLowerCase())) return false;

    if (f.genero) {
      const g = norm(f.genero);
      const tiene = (v.venue_genres ?? []).some(
        (vg) => norm(vg.genres?.nombre) === g
      );
      if (!tiene) return false;
    }

    if (f.zona && norm(v.zones?.nombre) !== norm(f.zona)) return false;
    if (f.ciudad && norm(v.cities?.nombre) !== norm(f.ciudad)) return false;
    if (f.vestimenta && norm(v.vestimenta) !== norm(f.vestimenta)) return false;

    if (Number.isFinite(edad) && !aceptaEdad(v.rango_edad, edad)) return false;

    if (f.cuando) {
      if (f.cuando === "hoy") {
        if (!abreHoy(v, noche)) return false;
      } else if (/^[0-6]$/.test(f.cuando)) {
        if (!abreEnDia(v, Number(f.cuando))) return false;
      }
    }

    return true;
  });

  // El precio se filtra al final: si no conocemos el precio de un local, no
  // podemos decir que cumple, así que lo dejamos fuera y lo contamos aparte.
  let ocultosPorPrecio = 0;
  if (f.precio) {
    const antes = lista;
    if (f.precio === "gratis") {
      lista = antes.filter((v) => num(v.precio_entrada) === 0);
    } else {
      const max = Number(f.precio);
      if (Number.isFinite(max)) {
        lista = antes.filter((v) => {
          const ref = precioReferencia(v);
          return ref !== null && ref <= max;
        });
      }
    }
    ocultosPorPrecio = antes.filter(
      (v) => precioReferencia(v) === null && num(v.precio_entrada) === null
    ).length;
  }

  return { resultados: lista, ocultosPorPrecio };
}


/* ------------------------------------------------------------------ */
/* Fiestas (LaVainaBailable y similares: rotan de local)               */
/* ------------------------------------------------------------------ */

export type FiestaConFechas = Fiesta & {
  fechas: (VenueEvent & {
    venues: { id: string; nombre: string; zones: { nombre: string } | null; cities: { nombre: string } | null } | null;
  })[];
};

export async function getFiestaById(id: string): Promise<FiestaConFechas | null> {
  const { data: fiesta, error: errorFiesta } = await supabase
    .from("fiestas")
    .select("id, nombre, descripcion, instagram, web, logo_url")
    .eq("id", id)
    .eq("activo", true)
    .single();

  if (errorFiesta || !fiesta) {
    console.error("Error cargando la fiesta:", errorFiesta?.message);
    return null;
  }

  const { data: fechas, error: errorFechas } = await supabase
    .from("events")
    .select(
      "id, nombre, descripcion, fecha_inicio, fecha_fin, precio_desde, foto_url, entrada_url, venues ( id, nombre, zones ( nombre ), cities ( nombre ) )"
    )
    .eq("fiesta_id", id)
    .order("fecha_inicio");

  if (errorFechas) {
    console.error("Error cargando las fechas de la fiesta:", errorFechas.message);
  }

  return { ...fiesta, fechas: (fechas ?? []) as unknown as FiestaConFechas["fechas"] };
}


// Un evento concreto, con el local y la fiesta a la que pertenece (si tiene)
export async function getEventoById(id: string): Promise<EventoDetalle | null> {
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, nombre, descripcion, fecha_inicio, fecha_fin, precio_desde, foto_url, entrada_url, fiestas ( id, nombre, descripcion, instagram, web, logo_url ), venues ( id, nombre, direccion, zones ( nombre ), cities ( nombre ) )"
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error cargando el evento:", error.message);
    return null;
  }

  return data as unknown as EventoDetalle;
}
