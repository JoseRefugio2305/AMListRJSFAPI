import { Button, ButtonGroup } from "flowbite-react";
import { optionsTypeStat, TypeStatsEnum } from "../../../types/statsTypes";
import { Dropdown } from "primereact/dropdown";
import { useId } from "react";
import type { OptionsSelectInterface } from "../../../types/filterTypes";

interface TabMenuStatsProps {
   loadingStats: boolean;
   statActive: TypeStatsEnum;
   setStatActive: (typeS: TypeStatsEnum) => void;
   setSelTypeStat: (item: OptionsSelectInterface) => void;
   selTypeStat: OptionsSelectInterface;
   isDashboard: boolean;
}

export function TabMenuStats({
   loadingStats,
   statActive,
   setStatActive,
   setSelTypeStat,
   selTypeStat,
   isDashboard,
}: TabMenuStatsProps) {
   const idSelTypeStat = useId();
   return (
      <div className="w-full flex justify-center items-center">
         <ButtonGroup className="h-10 hidden md:flex">
            {!isDashboard && (
               <Button
                  disabled={loadingStats}
                  className="h-10"
                  outline={statActive !== TypeStatsEnum.a_m_favs}
                  color="purple"
                  onClick={() => {
                     setStatActive(TypeStatsEnum.a_m_favs);
                     setSelTypeStat(
                        optionsTypeStat.find(
                           (opt) => opt.code === TypeStatsEnum.a_m_favs
                        ) ?? optionsTypeStat[TypeStatsEnum.a_m_favs]
                     );
                  }}
               >
                  <p className="text-md font-bold">
                     Estado de Lectura/Visualización
                  </p>
               </Button>
            )}
            <Button
               disabled={loadingStats}
               className="h-10"
               outline={statActive !== TypeStatsEnum.tipo_a_m}
               color="purple"
               onClick={() => {
                  setStatActive(TypeStatsEnum.tipo_a_m);
                  setSelTypeStat(
                     optionsTypeStat.find(
                        (opt) => opt.code === TypeStatsEnum.tipo_a_m
                     ) ?? optionsTypeStat[TypeStatsEnum.tipo_a_m]
                  );
               }}
            >
               <p className="text-md font-bold">Tipo Anime/Manga</p>
            </Button>
            <Button
               disabled={loadingStats}
               className="h-10"
               outline={statActive !== TypeStatsEnum.generos}
               color="purple"
               onClick={() => {
                  setStatActive(TypeStatsEnum.generos);
                  setSelTypeStat(
                     optionsTypeStat.find(
                        (opt) => opt.code === TypeStatsEnum.generos
                     ) ?? optionsTypeStat[TypeStatsEnum.generos]
                  );
               }}
            >
               <p className="text-md font-bold">Generos</p>
            </Button>
            <Button
               disabled={loadingStats}
               className="h-10"
               outline={statActive !== TypeStatsEnum.editorials}
               color="purple"
               onClick={() => {
                  setStatActive(TypeStatsEnum.editorials);
                  setSelTypeStat(
                     optionsTypeStat.find(
                        (opt) => opt.code === TypeStatsEnum.editorials
                     ) ?? optionsTypeStat[TypeStatsEnum.editorials]
                  );
               }}
            >
               <p className="text-md font-bold">Top Editoriales de Manga</p>
            </Button>
            <Button
               disabled={loadingStats}
               className="h-10"
               outline={statActive !== TypeStatsEnum.studios}
               color="purple"
               onClick={() => {
                  setStatActive(TypeStatsEnum.studios);
                  setSelTypeStat(
                     optionsTypeStat.find(
                        (opt) => opt.code === TypeStatsEnum.studios
                     ) ?? optionsTypeStat[TypeStatsEnum.studios]
                  );
               }}
            >
               <p className="text-md font-bold">Top Estudios de Anime</p>
            </Button>
         </ButtonGroup>
         <div className="w-[90%] mb-2 min-w-0 block md:hidden mx-auto">
            <Dropdown
               disabled={loadingStats}
               value={selTypeStat}
               onChange={(e) => {
                  setSelTypeStat(e.value);
                  setStatActive(e.value?.code);
               }}
               options={optionsTypeStat.filter(
                  (opt) => opt.code !== TypeStatsEnum.a_m_favs
               )}
               optionLabel="name"
               placeholder="Selecciona un tipo de Estadísticas"
               className="w-full"
               id={idSelTypeStat}
            />
         </div>
      </div>
   );
}
