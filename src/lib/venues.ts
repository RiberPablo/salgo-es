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
  instagram: string | null;
  web: string | null;
  rango_edad: string | null;
  vestimenta: string | null;
  zones: { nombre: string } | null;
  cities: { nombre: string } | null;
  photos: { image_url: string; is_main: boolean }[];
  venue_genres: { genres: { nombre: string } }[];
  schedules?: { dia_semana: number; apertura: string | null; cierre: string | null }[];
};

const VENUE_SELECT = `
  id, nombre, descripcion, direccion, tipo_local,
  precio_entrada, precio_copa, precio_medio, instagram, web,
  rango_edad, vestimenta,
  zones ( nombre ),
  cities ( nombre ),
  photos ( image_url, is_main ),
  venue_genres ( genres ( nombre ) ),
  schedules ( dia_semana, apertura, cierre )
`;

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
  genero?: string; // nombre del genero musical, ej: "Reggaeton"
};

export async function searchVenues(params: SearchParams): Promise<Venue[]> {
  const { q, tipo, genero } = params;

  // Si filtramos por genero necesitamos el inner join para que solo
  // devuelva locales que SI tengan ese genero asociado.
  const select = genero
    ? VENUE_SELECT.replace(
        "venue_genres ( genres ( nombre ) )",
        "venue_genres!inner ( genres!inner ( nombre ) )"
      )
    : VENUE_SELECT;

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

  const { data, error } = await query.order("nombre");

  if (error) {
    console.error("Error buscando locales:", error.message);
    return [];
  }

  return data as unknown as Venue[];
}
