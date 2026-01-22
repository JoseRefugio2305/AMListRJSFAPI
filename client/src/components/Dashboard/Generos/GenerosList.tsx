import { DataTable } from "primereact/datatable";
import { NotResultsFound } from "../../Common/NotResultsFound";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import {
   FieldOrdGSAEEnum,
   lazyStateInicial,
   TipoGSAEEnum,
   type FilterGSAEPayload,
   type LazyTableStateInc,
} from "../../../types/filterTypes";
import { HeaderGenerosList } from "./HeaderGenerosList";
import { AccionesGenerosList } from "./AccionesGenerosList";
import { getGSAE } from "../../../services/searchServices";
import type { GSAESchema } from "../../../schemas/gsaeSchema";

export default function GenerosList() {
   const [generos, setGeneros] = useState<GSAESchema[]>([]);
   const [totalGen, seTotalGen] = useState<number>(0);
   const [lazyState, setLazyState] =
      useState<LazyTableStateInc>(lazyStateInicial);
   const [loading, setLoading] = useState<boolean>(true);

   const fetchGeneros = () => {
      console.log(lazyState);

      const filters: FilterGSAEPayload = {
         limit: 20,
         page: lazyState.page + 1,
         txtSearch: "",
         orderBy: lazyState.sortOrder === 1 ? 1 : -1,
         orderField: (() => {
            const key = (lazyState.sortField || "id_MAL").trim();
            return Object.prototype.hasOwnProperty.call(FieldOrdGSAEEnum, key)
               ? FieldOrdGSAEEnum[key as keyof typeof FieldOrdGSAEEnum]
               : FieldOrdGSAEEnum.id_MAL;
         })(),
      };
      if (lazyState.filters.global && lazyState.filters.global.value) {
         filters.txtSearch = lazyState.filters.global.value.trim();
      }
      getGSAE(filters, TipoGSAEEnum.generos)
         .then((resp) => {
            setGeneros(resp.lista ?? []);
            seTotalGen(resp.total ?? 0);
            setLoading(false);
         })
         .catch((error) => {
            console.error(error);
            setGeneros([]);
            seTotalGen(0);
            setLoading(false);
         });
   };

   useEffect(() => {
      fetchGeneros();
   }, [lazyState]);

   return (
      <>
         <h2 className="text-xl font-bold">{totalGen} Géneros</h2>
         <DataTable
            value={generos}
            lazy
            dataKey="id_MAL"
            rows={20}
            header={() => (
               <HeaderGenerosList
                  loading={loading}
                  setLoading={setLoading}
                  setLazyState={setLazyState}
               />
            )}
            paginator
            paginatorPosition="both"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            currentPageReportTemplate={`Mostrando ${
               totalGen > 0 ? lazyState.first + 1 : totalGen
            } a ${Math.min(
               lazyState.rows + lazyState.first,
               totalGen
            )} géneros(s) de ${totalGen} resultados`}
            first={lazyState.first}
            totalRecords={totalGen}
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
               <NotResultsFound message="No Se Encontraron Géneros Que Concuerden con la Búsqueda." />
            }
            className="rounded-2xl"
         >
            <Column sortable field="id_MAL" header="ID MAL" />
            <Column field="nombre" sortable header="Nombre" />
            <Column
               header="Acciones"
               body={(rowData) => (
                  <AccionesGenerosList
                     genero={rowData}
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
