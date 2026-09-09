import { supabase } from "./supabase";

export type Venue = {
  id: string;
  nombre: string;
  descripcion: string | null;
  direccion: string | null;
  tipo_local: string | null;
  precio_entrada: number | null;
  precio_copa: number | null;
  instagram: string | null;
  web: string | null;
  zones: { nombre: string } | null;
  cities: { nombre: string } | null;
  photos: { image_url: string; is_main: boolean }[];
  venue_genres: { genres: { nombre: string } }[];
};

export async function getVenues(): Promise<Venue[]> {
  const { data, error } = await supabase
    .from("venues")
    .select(
      `
      id, nombre, descripcion, direccion, tipo_local,
      precio_entrada, precio_copa, instagram, web,
      zones ( nombre ),
      cities ( nombre ),
      photos ( image_url, is_main ),
      venue_genres ( genres ( nombre ) )
    `
    )
    .eq("activo", true)
    .order("nombre");

  if (error) {
    console.error("Error cargando locales:", error.message);
    return [];
  }

  return data as unknown as Venue[];
}