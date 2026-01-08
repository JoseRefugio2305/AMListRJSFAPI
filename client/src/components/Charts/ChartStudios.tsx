import type { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import type {
   FavsCountSchema,
   FullStatsSchema,
} from "../../schemas/statsSchemas";
import { themeStore } from "../../store/themeStore";
import { MessageNoContenido } from "../Common/User/MessageNoContenido";

interface ChartStudiosProps {
   dataStats: FavsCountSchema | FullStatsSchema | null;
}

interface StateChart {
   series: { data: number[] }[];
   options: ApexOptions;
}

export default function ChartStudios({ dataStats }: ChartStudiosProps) {
   const { theme } = themeStore();
   const [totalAnimes, setTotalAnimes] = useState<number>(0);

   const [state, setState] = useState<StateChart>({
      series: [
         {
            data: [],
         },
      ],
      options: {
         theme: { mode: theme },
         chart: {
            type: "bar",
            height: 350,
         },
         colors: ["#9F24E3"],
         plotOptions: {
            bar: {
               borderRadius: 4,
               borderRadiusApplication: "end",
               horizontal: true,
            },
         },
         dataLabels: {
            enabled: true,
         },
         xaxis: {
            categories: [],
         },
      },
   });

   useEffect(() => {
      const getSeriesCats = () => {
         const series: number[] = [];
         const cats: string[] = [];
         let totAn = 0;
         dataStats?.topStudios.forEach((tstd) => {
            series.push(tstd.conteoanimes);
            cats.push(tstd.nombre);
            totAn += tstd.conteoanimes;
         });

         setState((prev) => {
            return {
               ...prev,
               series: [{ data: series }],
               options: {
                  ...prev.options,
                  xaxis: {
                     ...(prev.options as ApexOptions).xaxis,
                     categories: cats,
                  },
               },
            };
         });

         setTotalAnimes(totAn);
      };
      getSeriesCats();
   }, []);

   useEffect(() => {
      const changeColorLabels = () => {
         setState((prev) => ({
            ...prev,
            options: {
               ...prev.options,
               theme: {
                  mode: theme,
               },
            },
         }));
      };
      changeColorLabels();
   }, [theme]);

   return (
      <div>
         {totalAnimes > 0 ? (
            <>
               <h3 className="text-xl font-semibold text-center">
                  Top Estudios de Anime
               </h3>
               <div id="chart">
                  <ReactApexChart
                     options={state.options}
                     series={state.series}
                     type="bar"
                     height={350}
                  />
               </div>
               <div id="html-dist"></div>
            </>
         ) : (
            <MessageNoContenido typeCont={1} />
         )}
      </div>
   );
}
