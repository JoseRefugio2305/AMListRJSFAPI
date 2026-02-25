import { useEffect, useState } from "react";
import type { AnimeIncompleteSchema } from "../../../schemas/animeSchemas";
import { DataTable } from "primereact/datatable";
import { NotResultsFound } from "../../Common/NotResultsFound";
import { Column } from "primereact/column";
import {
   FieldOrdEnum,
   lazyStateInicial,
   ReadyToMALEnum,
   type FilterPayload,
   type LazyTableStateInc,
   type OptionsSelectInterface,
} from "../../../types/filterTypes";
import { getIncompleteAnimes } from "../../../services/searchServices";
import { getAnimeStrType, getColorTipoAnimeManga } from "../../../utils/common";
import { HeaderAnimeInc } from "./HeaderAnimeInc";
import { AccionesIncList } from "./AccionesIncList";
import type { TipoAnimeEnum } from "../../../types/animeTypes";

export default function AnimeIncompleteList() {
   const [animesInc, setAnimesInc] = useState<AnimeIncompleteSchema[]>([]);
   const [totalInc, setTotalInc] = useState<number>(0);
   const [selTipoAnime, setSelTipoAnime] =
      useState<OptionsSelectInterface | null>(null);
   const [selStatusAct, setSelStatusAct] =
      useState<OptionsSelectInterface | null>(null);

   const [loading, setLoading] = useState<boolean>(true);
   const [lazyState, setLazyState] =
      useState<LazyTableStateInc>(lazyStateInicial);

   const fetchIncimplete = () => {
      console.log(lazyState);

      const filters: FilterPayload = {
         limit: 20,
         page: lazyState.page + 1,
         tiposAnime: selTipoAnime ? [selTipoAnime.code as TipoAnimeEnum] : [],
         orderBy: lazyState.sortOrder === 1 ? 1 : -1,
         orderField: (() => {
            const key = (lazyState.sortField || "key").trim();
            return Object.prototype.hasOwnProperty.call(FieldOrdEnum, key)
               ? FieldOrdEnum[key as keyof typeof FieldOrdEnum]
               : FieldOrdEnum.key;
         })(),
      };

      const globalFilter = lazyState.filters.global;
      if (globalFilter && "value" in globalFilter && globalFilter.value) {
         filters.tituloBusq = globalFilter.value.trim();
      }
      getIncompleteAnimes(filters, (selStatusAct?.code ?? 2) as ReadyToMALEnum)
         .then((resp) => {
            setAnimesInc(resp.listaAnimes ?? []);
            setTotalInc(resp.totalAnimes ?? 0);
            setLoading(false);
         })
         .catch((error) => {
            console.error(error);
            setAnimesInc([]);
            setTotalInc(0);
            setLoading(false);
         });
   };

   useEffect(() => {
      fetchIncimplete();
   }, [lazyState]);

   return (
      <>
         <h2 className="text-xl font-bold">
            {totalInc} Animes Pendientes de Actualizar A MAL
         </h2>

         <DataTable
            value={animesInc}
            lazy
            dataKey="key_anime"
            rows={20}
            header={() => (
               <HeaderAnimeInc
                  loading={loading}
                  setLoading={setLoading}
                  setLazyState={setLazyState}
                  setSelStatusAct={setSelStatusAct}
                  selStatusAct={selStatusAct}
                  setSelTipoAnime={setSelTipoAnime}
                  selTipoAnime={selTipoAnime}
               />
            )}
            paginator
            paginatorPosition="both"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            currentPageReportTemplate={`Mostrando ${
               totalInc > 0 ? lazyState.first + 1 : totalInc
            } a ${Math.min(
               lazyState.rows + lazyState.first,
               totalInc,
            )} anime(s) de ${totalInc} resultados`}
            first={lazyState.first}
            totalRecords={totalInc}
            onPage={(event) => {
               setLoading(true);
               setLazyState((prev) => {
                  return {
                     ...prev,
                     ...event,
                  };
               });
            }}
            onSort={(event) => {
               setLoading(true);
               setLazyState((prev) => {
                  return {
                     ...prev,
                     ...event,
                  };
               });
            }}
            sortField={lazyState.sortField ?? ""}
            sortOrder={lazyState.sortOrder ?? 0}
            loading={loading}
            rowHover={true}
            emptyMessage={
               <NotResultsFound message="No Se Encontraron Animes Incompletos Que Concuerden con la Búsqueda." />
            }
            className="rounded-2xl"
         >
            <Column field="key_anime" header="Key" sortable />
            <Column
               sortable
               field="id_MAL"
               body={(aInc) => {
                  return aInc.id_MAL ? (
                     aInc.id_MAL
                  ) : (
                     <p className="w-full font-bold text-white rounded-2xl p-1 bg-red-600 text-center">
                        Sin Asignar
                     </p>
                  );
               }}
               header="ID MAL"
            />
            <Column field="titulo" sortable header="Título" />
            <Column
               field="tipo"
               body={(aInc) => {
                  return (
                     <p
                        className={`w-full font-bold text-white rounded-2xl p-1 text-center ${getColorTipoAnimeManga(
                           aInc.tipo,
                           0,
                        )}`}
                     >
                        {getAnimeStrType(aInc.tipo)}
                     </p>
                  );
               }}
               header="Tipo"
            />
            <Column
               header="Acciones"
               body={(rowData) => (
                  <AccionesIncList
                     animeInc={rowData}
                     callBackDel={() => {
                        setLoading(true);
                        setLazyState((prev) => {
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
