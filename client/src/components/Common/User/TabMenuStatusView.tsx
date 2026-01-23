import { Button, ButtonGroup } from "flowbite-react";
import {
   optionsStatusView,
   StatusViewEnum,
   type FilterParamsInterface,
   type OptionsSelectInterface,
} from "../../../types/filterTypes";
import { Dropdown } from "primereact/dropdown";
import { useId, useState, type Dispatch, type SetStateAction } from "react";

interface TabMenuStatusViewProps {
   isAnime: boolean;
   loading: boolean;
   filtersParam: FilterParamsInterface;
   setFiltersParams: Dispatch<SetStateAction<FilterParamsInterface>>;
   setPage: Dispatch<SetStateAction<number>>;
}

export function TabMenuStatusView({
   isAnime,
   loading,
   filtersParam,
   setFiltersParams,
   setPage,
}: TabMenuStatusViewProps) {
   const idSelStatusView = useId();
   const [statusActive, setStatusActive] = useState<StatusViewEnum>(
      filtersParam.statusView ?? StatusViewEnum.ninguno
   );
   const [selStatusView, setSelStatusView] = useState<OptionsSelectInterface>(
      () => {
         const actualStatus = filtersParam.statusView ?? StatusViewEnum.ninguno;
         return (
            optionsStatusView.find((opt) => opt.code === actualStatus) ??
            optionsStatusView[actualStatus]
         );
      }
   );

   const handleChangeStatus = (status: StatusViewEnum) => {
      setStatusActive(status);
      setSelStatusView(
         optionsStatusView.find((opt) => opt.code === status) ??
            optionsStatusView[status]
      );
      if (status !== filtersParam.statusView) {
         setPage(1);
      }
      setFiltersParams((prev) => {
         return {
            ...prev,
            statusView: status,
         };
      });
   };

   return (
      <div className="w-full flex justify-center items-center">
         <ButtonGroup className="h-10 hidden md:flex">
            <Button
               disabled={loading}
               className="h-10"
               outline={statusActive !== StatusViewEnum.ninguno}
               color="purple"
               onClick={() => {
                  handleChangeStatus(StatusViewEnum.ninguno);
               }}
            >
               <p className="text-md font-bold">Todos</p>
            </Button>
            <Button
               disabled={loading}
               className="h-10"
               outline={statusActive !== StatusViewEnum.viendo}
               color="green"
               onClick={() => {
                  handleChangeStatus(StatusViewEnum.viendo);
               }}
            >
               <p className="text-md font-bold">
                  {isAnime ? "Viendo" : "Leyendo"}
               </p>
            </Button>
            <Button
               disabled={loading}
               className="h-10"
               outline={statusActive !== StatusViewEnum.completado}
               color="pink"
               onClick={() => {
                  handleChangeStatus(StatusViewEnum.completado);
               }}
            >
               <p className="text-md font-bold">Completados</p>
            </Button>
            <Button
               disabled={loading}
               className="h-10"
               outline={statusActive !== StatusViewEnum.pendiente}
               color="default"
               onClick={() => {
                  handleChangeStatus(StatusViewEnum.pendiente);
               }}
            >
               <p className="text-md font-bold">Pendientes</p>
            </Button>
            <Button
               disabled={loading}
               className="h-10"
               outline={statusActive !== StatusViewEnum.considerando}
               color="yellow"
               onClick={() => {
                  handleChangeStatus(StatusViewEnum.considerando);
               }}
            >
               <p className="text-md font-bold">Considerando</p>
            </Button>
            <Button
               disabled={loading}
               className="h-10"
               outline={statusActive !== StatusViewEnum.abandonado}
               color="red"
               onClick={() => {
                  handleChangeStatus(StatusViewEnum.abandonado);
               }}
            >
               <p className="text-md font-bold">Abandonados</p>
            </Button>
         </ButtonGroup>
         <div className="w-[90%] mb-2 min-w-0 block md:hidden mx-auto">
            <Dropdown
               disabled={loading}
               value={selStatusView}
               onChange={(e) => {
                  handleChangeStatus(e.value?.code ?? StatusViewEnum.ninguno);
               }}
               options={optionsStatusView}
               optionLabel="name"
               placeholder="Selecciona un tipo de Estadísticas"
               className="w-full"
               id={idSelStatusView}
            />
         </div>
      </div>
   );
}
