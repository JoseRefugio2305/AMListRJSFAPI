import { Button, ButtonGroup } from "flowbite-react";
import {
   optionsStatusView,
   StatusViewEnum,
   type FilterParamsInterface,
   type OptionsSelectInterface,
} from "../../../types/filterTypes";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useId, useState } from "react";

interface TabMenuStatusViewProps {
   isAnime: boolean;
   loading: boolean;
   filtersParam: FilterParamsInterface;
   setFiltersParams: (
      callback: (prev: FilterParamsInterface) => FilterParamsInterface
   ) => void;
   setPage: (page: number) => void;
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

   useEffect(() => {
      const handleChangeStatus = () => {
         setFiltersParams((prev) => {
            return {
               ...prev,
               statusView: statusActive,
            };
         });
         setPage(1);
      };
      handleChangeStatus();
   }, [statusActive]);

   return (
      <div className="w-full flex justify-center items-center">
         <ButtonGroup className="h-10 hidden md:flex">
            <Button
               disabled={loading}
               className="h-10"
               outline={statusActive !== StatusViewEnum.ninguno}
               color="purple"
               onClick={() => {
                  setStatusActive(StatusViewEnum.ninguno);
                  setSelStatusView(
                     optionsStatusView.find(
                        (opt) => opt.code === StatusViewEnum.ninguno
                     ) ?? optionsStatusView[StatusViewEnum.ninguno]
                  );
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
                  setStatusActive(StatusViewEnum.viendo);
                  setSelStatusView(
                     optionsStatusView.find(
                        (opt) => opt.code === StatusViewEnum.viendo
                     ) ?? optionsStatusView[StatusViewEnum.viendo]
                  );
               }}
            >
               <p className="text-md font-bold">
                  {isAnime ? "Viendo" : "Leyendo"}
               </p>
            </Button>
            <Button
               disabled={loading}
               className="h-10"
               outline={statusActive !== StatusViewEnum.pendiente}
               color="default"
               onClick={() => {
                  setStatusActive(StatusViewEnum.pendiente);
                  setSelStatusView(
                     optionsStatusView.find(
                        (opt) => opt.code === StatusViewEnum.pendiente
                     ) ?? optionsStatusView[StatusViewEnum.pendiente]
                  );
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
                  setStatusActive(StatusViewEnum.considerando);
                  setSelStatusView(
                     optionsStatusView.find(
                        (opt) => opt.code === StatusViewEnum.considerando
                     ) ?? optionsStatusView[StatusViewEnum.considerando]
                  );
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
                  setStatusActive(StatusViewEnum.abandonado);
                  setSelStatusView(
                     optionsStatusView.find(
                        (opt) => opt.code === StatusViewEnum.abandonado
                     ) ?? optionsStatusView[StatusViewEnum.abandonado]
                  );
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
                  setSelStatusView(e.value);
                  setStatusActive(e.value?.code);
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
