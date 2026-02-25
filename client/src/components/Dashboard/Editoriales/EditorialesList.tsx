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

export default function EditorialesList() {
   const [editoriales, setEditoriales] = useState<GSAESchema[]>([]);
   const [totalEdt, seTotalEdt] = useState<number>(0);
   const [lazyState, setLazyState] =
      useState<LazyTableStateInc>(lazyStateInicial);
   const [loading, setLoading] = useState<boolean>(true);

   const fetchEditoriales = () => {
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
      getGSAE(filters, TipoGSAEEnum.editoriales)
         .then((resp) => {
            setEditoriales(resp.lista ?? []);
            seTotalEdt(resp.total ?? 0);
            setLoading(false);
         })
         .catch((error) => {
            console.error(error);
            setEditoriales([]);
            seTotalEdt(0);
            setLoading(false);
         });
   };

   useEffect(() => {
      fetchEditoriales();
   }, [lazyState]);

   return (
      <>
         <h2 className="text-xl font-bold">{totalEdt} Editoriales de Manga</h2>
         <DataTable
            value={editoriales}
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
               totalEdt > 0 ? lazyState.first + 1 : totalEdt
            } a ${Math.min(
               lazyState.rows + lazyState.first,
               totalEdt,
            )} editorial(es) de ${totalEdt} resultados`}
            first={lazyState.first}
            totalRecords={totalEdt}
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
               <NotResultsFound message="No Se Encontraron Editoriales de Manga Que Concuerden con la Búsqueda." />
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
                     typeGSAE={TipoGSAEEnum.editoriales}
                  />
               )}
            />
         </DataTable>
      </>
   );
}
