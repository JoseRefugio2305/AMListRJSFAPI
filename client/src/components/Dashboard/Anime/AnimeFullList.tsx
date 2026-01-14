import { useEffect, useState } from "react";
import { useFilters } from "../../../hooks/useFilters";
import { FieldOrdEnum, TipoContenidoEnum } from "../../../types/filterTypes";
import { SearchForm } from "../../Search/SearchForm";
import {
   DataTable,
   type DataTableSortEvent,
   type DataTableStateEvent,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { NotResultsFound } from "../../Common/NotResultsFound";
import { AccionesFullList } from "./AccionesFullList";

interface LazyTableState {
   first: number;
   rows: number;
   page: number;
   sortField?: string | null;
   sortOrder?: 1 | -1 | 0 | null;
}

export default function AnimeFullList() {
   const {
      animes,
      totalAnimes,
      filtersParam,
      setFiltersParam,
      page,
      setPage,
      loading,
   } = useFilters(TipoContenidoEnum.anime);

   const [lazyState, setLazyState] = useState<LazyTableState>({
      first: 20 * (page - 1),
      rows: 20,
      page: page,
      sortField:
         filtersParam.orderField === "key"
            ? "key_anime"
            : filtersParam.orderField,
      sortOrder: filtersParam.orderBy === "asc" ? 1 : -1,
   });

   useEffect(() => {
      const changeLazy = () => {
         setLazyState((prev) => {
            return {
               ...prev,
               sortField:
                  filtersParam.orderField === "key"
                     ? "key_anime"
                     : filtersParam.orderField,
               sortOrder: filtersParam.orderBy === "asc" ? 1 : -1,
            };
         });
      };
      changeLazy();
   }, [filtersParam]);

   const handleSort = (event: DataTableSortEvent) => {
      setFiltersParam((prev) => {
         return {
            ...prev,
            orderBy: event.sortOrder === 1 ? "asc" : "desc",
            orderField: (() => {
               const sortField =
                  event.sortField === "key_anime" ? "key" : event.sortField;
               const key = (sortField || "key").trim();
               return Object.prototype.hasOwnProperty.call(FieldOrdEnum, key)
                  ? FieldOrdEnum[key as keyof typeof FieldOrdEnum]
                  : FieldOrdEnum.key;
            })(),
         };
      });
      setPage(1);

      setLazyState((prev) => {
         return {
            ...prev,
            ...event,
            page: 0,
            first: 0,
         };
      });
   };

   const handlePage = (event: DataTableStateEvent) => {
      console.log(event);
      setPage(event.page ? event.page + 1 : 0);
      setLazyState((prev) => {
         return {
            ...prev,
            ...event,
         };
      });
   };

   return (
      <>
         <section className="w-auto grid gap-5 shadow-2xl md:rounded-2xl rounded-none dark:bg-gray-700 p-6">
            <SearchForm
               filtersParam={filtersParam}
               setFiltersParam={setFiltersParam}
               setPage={setPage}
               tipoContenido={TipoContenidoEnum.anime}
            />
         </section>
         <section className="w-full grid gap-5 shadow-2xl md:rounded-2xl rounded-none dark:bg-gray-700 p-6 mt-4 mb-1">
            <h2 className="text-xl font-bold">{totalAnimes} Resultado(s)</h2>
            
         </section>
         <DataTable
               value={animes}
               lazy
               dataKey="key_anime"
               rows={20}
               paginator
               paginatorPosition="both"
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
               currentPageReportTemplate={`Mostrando ${
                  totalAnimes > 0 ? lazyState.first + 1 : totalAnimes
               } a ${Math.min(
                  lazyState.rows + lazyState.first,
                  totalAnimes
               )} anime(s) de ${totalAnimes} resultados`}
               first={lazyState.first}
               totalRecords={totalAnimes}
               onPage={handlePage}
               onSort={handleSort}
               sortField={lazyState.sortField ?? ""}
               sortOrder={lazyState.sortOrder ?? 0}
               loading={loading}
               rowHover={true}
               emptyMessage={
                  <NotResultsFound message="No Se Encontraron Animes Que Concuerden con la Búsqueda." />
               }
               className="rounded-2xl"
            >
               <Column field="key_anime" header="Key" sortable />
               <Column field="id_MAL" sortable header="ID MAL" />
               <Column field="titulo" sortable header="Título" />
               <Column field="episodios" sortable header="Episodios" />
               <Column field="calificacion" sortable header="Calificación" />
               <Column
                  header="Acciones"
                  body={(rowData) => (
                     <AccionesFullList
                        anime={rowData}
                        callBackDel={() => {
                           setFiltersParam((prev) => {
                              return { ...prev };
                           });
                        }}
                     />
                  )}
               />
            </DataTable>
      </>
   );
}
