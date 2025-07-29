import type { ApiArtwork, Artwork, FetchArtworksResponse } from "../types";

export async function fetchArtworksFromApi(
  page: number,
  limit: number
): Promise<FetchArtworksResponse> {
  const res = await fetch(
    `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${limit}`
  );
  const json = await res.json();

  const artworks: Artwork[] = (json.data as ApiArtwork[]).map((item) => ({
    id: item.id,
    title: item.title,
    place_of_origin: item.place_of_origin,
    artist_display: item.artist_display,
    inscriptions: item.inscriptions ?? "-",
    date_start: item.date_start,
    date_end: item.date_end,
  }));

  const totalRecords: number = json.pagination?.total ?? artworks.length;

  return { artworks, totalRecords };
}
