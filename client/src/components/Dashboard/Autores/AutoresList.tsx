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
import { getGSAE } from "../../../services/searchServices";
import type { GSAESchema } from "../../../schemas/gsaeSchema";
import { AccionesGSAEList } from "../Generos/AccionesGenerosList";
import { HeaderGSAEList } from "../Generos/HeaderGSAEList";

export default function AutoresList() {
   const [autores, setAutores] = useState<GSAESchema[]>([]);
   const [totalAut, seTotalAut] = useState<number>(0);
   const [lazyState, setLazyState] =
      useState<LazyTableStateInc>(lazyStateInicial);
   const [loading, setLoading] = useState<boolean>(true);

   const fetchAutores = () => {
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
      const globalFilter = lazyState.filters.global;
      if (globalFilter && "value" in globalFilter && globalFilter.value) {
         filters.txtSearch = globalFilter.value.trim();
      }
      getGSAE(filters, TipoGSAEEnum.autores)
         .then((resp) => {
            setAutores(resp.lista ?? []);
            seTotalAut(resp.total ?? 0);
            setLoading(false);
         })
         .catch((error) => {
            console.error(error);
            setAutores([]);
            seTotalAut(0);
            setLoading(false);
         });
   };

   useEffect(() => {
      fetchAutores();
   }, [lazyState]);

   return (
      <>
         <h2 className="text-xl font-bold">{totalAut} Autores de Manga</h2>
         <DataTable
            value={autores}
            lazy
            dataKey="id_MAL"
            rows={20}
            header={() => (
               <HeaderGSAEList
                  loading={loading}
                  setLoading={setLoading}
                  setLazyState={setLazyState}
               />
            )}
            paginator
            paginatorPosition="both"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            currentPageReportTemplate={`Mostrando ${
               totalAut > 0 ? lazyState.first + 1 : totalAut
            } a ${Math.min(
               lazyState.rows + lazyState.first,
               totalAut,
            )} autor(es) de ${totalAut} resultados`}
            first={lazyState.first}
            totalRecords={totalAut}
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
               <NotResultsFound message="No Se Encontraron Autores de Manga Que Concuerden con la Búsqueda." />
            }
            className="rounded-2xl"
         >
            <Column sortable field="id_MAL" header="ID MAL" />
            <Column field="nombre" sortable header="Nombre" />
            <Column field="tipo" sortable header="Tipo" />
            <Column
               header="Acciones"
               body={(rowData) => (
                  <AccionesGSAEList
                     gsae={rowData}
                     typeGSAE={TipoGSAEEnum.autores}
                  />
               )}
            />
         </DataTable>
      </>
   );
}
