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
