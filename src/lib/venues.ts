import { supabase } from "./supabase";

export type Venue = {
  id: string;
  nombre: string;
  descripcion: string | null;
  direccion: string | null;
  tipo_local: string | null;
  precio_entrada: number | null;
  precio_copa: number | null;
  precio_medio: number | null;
  precio_persona_min: number | null;
  precio_persona_max: number | null;
  instagram: string | null;
  web: string | null;
  rango_edad: string | null;
  vestimenta: string | null;
  latitud: number | null;
  longitud: number | null;
  zones: { nombre: string } | null;
  cities: { nombre: string } | null;
  photos: { image_url: string; is_main: boolean }[];
  venue_genres: { genres: { nombre: string } }[];
  schedules?: { dia_semana: number; apertura: string | null; cierre: string | null }[];
};

// Un local con la distancia (en km) ya calculada respecto a la ubicación del usuario.
// distanciaKm queda undefined si no pedimos ubicación o si el local aún no tiene lat/lng.
export type VenueConDistancia = Venue & { distanciaKm?: number };

const VENUE_SELECT = `
  id, nombre, descripcion, direccion, tipo_local,
  precio_entrada, precio_copa, precio_medio,
  precio_persona_min, precio_persona_max,
  instagram, web,
  rango_edad, vestimenta,
  latitud, longitud,
  zones ( nombre ),
  cities ( nombre ),
  photos ( image_url, is_main ),
  venue_genres ( genres ( nombre ) ),
  schedules ( dia_semana, apertura, cierre )
`;

// Día de la semana (0 = domingo ... 6 = sábado) según la hora actual en Madrid,
// para que "hoy" no dependa de en qué zona horaria esté desplegado el servidor.
export function getMadridDayOfWeek(): number {
  const madridDateStr = new Date().toLocaleString("en-US", { timeZone: "Europe/Madrid" });
  return new Date(madridDateStr).getDay();
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

// Distancia en línea recta entre dos coordenadas (fórmula de Haversine), en kilómetros.
function distanciaKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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

// tipoLocal debe ser el valor singular guardado en BD: 'discoteca', 'pub', 'tardeo', 'bar'
export async function getVenuesByTipo(tipoLocal: string): Promise<Venue[]> {
  const { data, error } = await supabase
    .from("venues")
    .select(VENUE_SELECT)
    .eq("activo", true)
    .eq("tipo_local", tipoLocal)
    .order("nombre");

  if (error) {
    console.error("Error cargando locales por tipo:", error.message);
    return [];
  }

  return data as unknown as Venue[];
}

export type SearchParams = {
  q?: string; // texto libre: busca en nombre y direccion
  tipo?: string; // valor singular en BD: discoteca | pub | tardeo | bar
  genero?: string; // nombre exacto del genero musical tal cual está en BD, ej: "Reggaetón"
  dia?: number; // dia de la semana elegido por el usuario (0=domingo...6=sabado), no tiene que ser hoy
  lat?: number; // ubicación del usuario, para ordenar por cercanía
  lng?: number;
};

export async function searchVenues(params: SearchParams): Promise<VenueConDistancia[]> {
  const { q, tipo, genero, dia, lat, lng } = params;

  let select = VENUE_SELECT;

  // Si filtramos por genero o por dia necesitamos inner join para que
  // solo devuelva locales que SI cumplen esa condición (si no, Supabase trae
  // el local igual con la relación vacía).
  if (genero) {
    select = select.replace(
      "venue_genres ( genres ( nombre ) )",
      "venue_genres!inner ( genres!inner ( nombre ) )"
    );
  }

  if (dia != null) {
    select = select.replace(
      "schedules ( dia_semana, apertura, cierre )",
      "schedules!inner ( dia_semana, apertura, cierre )"
    );
  }

  let query = supabase.from("venues").select(select).eq("activo", true);

  if (tipo) {
    query = query.eq("tipo_local", tipo);
  }

  if (q && q.trim().length > 0) {
    const term = q.trim();
    query = query.or(`nombre.ilike.%${term}%,direccion.ilike.%${term}%`);
  }

  if (genero && genero.trim().length > 0) {
    query = query.ilike("venue_genres.genres.nombre", genero.trim());
  }

  if (dia != null) {
    // Los horarios son recurrentes por dia de la semana (no por fecha concreta),
    // asi que esto funciona igual si alguien planea un martes para el viernes
    // que si busca el propio viernes.
    query = query.eq("schedules.dia_semana", dia);
  }

  const { data, error } = await query.order("nombre");

  if (error) {
    console.error("Error buscando locales:", error.message);
    return [];
  }

  let venues = data as unknown as VenueConDistancia[];

  // Si el usuario compartió su ubicación, calculamos distancia y ordenamos
  // por cercanía. Los locales sin lat/lng todavía se quedan al final, no se
  // ocultan (así no desaparecen mientras vamos completando datos).
  if (lat != null && lng != null) {
    venues = venues.map((v) => ({
      ...v,
      distanciaKm:
        v.latitud != null && v.longitud != null
          ? distanciaKm(lat, lng, v.latitud, v.longitud)
          : undefined,
    }));

    venues.sort((a, b) => (a.distanciaKm ?? Infinity) - (b.distanciaKm ?? Infinity));
  }

  return venues;
}
