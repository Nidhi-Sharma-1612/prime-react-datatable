import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import type { DataTablePageEvent } from "primereact/datatable";
import { ChevronDown } from "lucide-react";
import { Loader2 } from "lucide-react";
import type { RowSelectorOverlayRef } from "./RowSelectorOverlay";
import RowSelectorOverlay from "./RowSelectorOverlay";

import type { Artwork } from "../types";
import { fetchArtworksFromApi } from "../utils/artworkApi";

function Table() {
  const [data, setData] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);
  const [selectedItems, setSelectedItems] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const rowSelectorRef = useRef<RowSelectorOverlayRef>(null);

  const fetchArtworks = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const { artworks, totalRecords } = await fetchArtworksFromApi(
        page,
        limit
      );
      setData(artworks);
      setTotalRecords(totalRecords);
    } catch (err) {
      console.error("Failed to fetch artworks:", err);
    } finally {
      setLoading(false);
    }
  };

  const onPage = (event: DataTablePageEvent) => {
    const newPage = event.first / event.rows + 1;
    setFirst(event.first);
    setRows(event.rows);
    fetchArtworks(newPage, event.rows);
  };

  const handleOverlayAction = async (
    count: number,
    selectedItems: Artwork[],
    rowsPerPage: number,
    setSelectedItems: React.Dispatch<React.SetStateAction<Artwork[]>>
  ) => {
    const pagesNeeded = Math.ceil(count / rowsPerPage);
    let collected: Artwork[] = [];

    for (let page = 1; page <= pagesNeeded; page++) {
      const { artworks } = await fetchArtworksFromApi(page, rowsPerPage);
      collected = [...collected, ...artworks];
      if (collected.length >= count) break;
    }

    const newSelection = collected.slice(0, count);

    const uniqueById = Array.from(
      new Map(newSelection.map((item) => [item.id, item])).values()
    );

    setSelectedItems(uniqueById);
  };

  const handleSelectionChange = (e: { value: Artwork[] }) => {
    const currentPageIds = new Set(data.map((item) => item.id));
    const updatedSelection = [
      ...selectedItems.filter((item) => !currentPageIds.has(item.id)),
      ...e.value,
    ];

    const uniqueSelection = Array.from(
      new Map(updatedSelection.map((item) => [item.id, item])).values()
    );

    setSelectedItems(uniqueSelection);
  };

  useEffect(() => {
    const initialPage = first / rows + 1;
    fetchArtworks(initialPage, rows);
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold text-center my-6">Artworks Table</h1>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="overflow-x-auto scroll-smooth transition-all duration-300">
          <DataTable
            value={data}
            lazy
            paginator
            totalRecords={totalRecords}
            first={first}
            rows={rows}
            onPage={onPage}
            selection={selectedItems.filter((item) =>
              data.some((row) => row.id === item.id)
            )}
            onSelectionChange={handleSelectionChange}
            dataKey="id"
            selectionMode="multiple"
            metaKeySelection={false}
            tableStyle={{ minWidth: "60rem" }}
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column
              header={() => (
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={(e) => rowSelectorRef.current?.toggle(e)}
                >
                  <ChevronDown size={16} />
                </div>
              )}
              headerStyle={{ width: "2rem" }}
            />

            <Column field="title" header="Title" />
            <Column field="place_of_origin" header="Origin" />
            <Column
              field="artist_display"
              header="Artist Display"
              bodyClassName="whitespace-pre-wrap break-words"
            />
            <Column
              field="inscriptions"
              header="Inscriptions"
              bodyClassName="whitespace-pre-wrap break-words"
            />
            <Column field="date_start" header="Date Start" />
            <Column field="date_end" header="Date End" />
          </DataTable>
        </div>
        {loading && (
          <div className="fixed inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000]">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-100 text-sm">
              <Loader2 className="animate-spin w-8 h-8" />
              <p className="text-md font-bold">Loading artworks</p>
            </div>
          </div>
        )}

        <RowSelectorOverlay
          ref={rowSelectorRef}
          onSubmit={handleOverlayAction}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          rowsPerPage={rows}
        />

        <div className="text-right text-sm text-gray-600 mt-2">
          Selected rows: {selectedItems.length}
        </div>
      </div>
    </>
  );
}

export default Table;
