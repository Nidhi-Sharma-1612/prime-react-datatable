export type ApiArtwork = {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string | null;
  date_start: number;
  date_end: number;
};

export type Artwork = {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
};

export type FetchArtworksResponse = {
  artworks: Artwork[];
  totalRecords: number;
};

export type OverlayPanelProps = {
  onSubmit: (
    count: number,
    selectedItems: Artwork[],
    rowsPerPage: number,
    setSelectedItems: React.Dispatch<React.SetStateAction<Artwork[]>>
  ) => void;
  selectedItems: Artwork[];
  rowsPerPage: number;
  setSelectedItems: React.Dispatch<React.SetStateAction<Artwork[]>>;
};
