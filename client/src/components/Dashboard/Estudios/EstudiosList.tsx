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

export default function EstudiosList() {
   const [estudios, setEstudios] = useState<GSAESchema[]>([]);
   const [totalStd, seTotalStd] = useState<number>(0);
   const [lazyState, setLazyState] =
      useState<LazyTableStateInc>(lazyStateInicial);
   const [loading, setLoading] = useState<boolean>(true);

   const fetchEstudios = () => {
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
      getGSAE(filters, TipoGSAEEnum.estudios)
         .then((resp) => {
            setEstudios(resp.lista ?? []);
            seTotalStd(resp.total ?? 0);
            setLoading(false);
         })
         .catch((error) => {
            console.error(error);
            setEstudios([]);
            seTotalStd(0);
            setLoading(false);
         });
   };

   useEffect(() => {
      fetchEstudios();
   }, [lazyState]);

   return (
      <>
         <h2 className="text-xl font-bold">{totalStd} Estudios de Animación</h2>
         <DataTable
            value={estudios}
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
               totalStd > 0 ? lazyState.first + 1 : totalStd
            } a ${Math.min(
               lazyState.rows + lazyState.first,
               totalStd,
            )} estudio(s) de ${totalStd} resultados`}
            first={lazyState.first}
            totalRecords={totalStd}
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
               <NotResultsFound message="No Se Encontraron Estudios de Animación Que Concuerden con la Búsqueda." />
            }
            className="rounded-2xl"
         >
            <Column sortable field="id_MAL" header="ID MAL" />
            <Column field="nombre" sortable header="Nombre" />
            <Column
               header="Acciones"
               body={(rowData) => (
                  <AccionesGSAEList
                     gsae={rowData}
                     typeGSAE={TipoGSAEEnum.estudios}
                  />
               )}
            />
         </DataTable>
      </>
   );
}
