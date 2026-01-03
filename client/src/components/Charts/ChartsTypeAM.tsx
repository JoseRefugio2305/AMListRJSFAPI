import { useEffect, useState } from "react";
import type { FavsCountSchema } from "../../schemas/statsSchemas";
import ReactApexChart from "react-apexcharts";
import { themeStore } from "../../store/themeStore";
import type { ApexOptions } from "apexcharts";
import { MessageNoContenido } from "../Common/User/MessageNoContenido";

interface ChartsTypeAMProps {
   dataStats: FavsCountSchema | null;
}

interface StateChart {
   series: number[];
   options: ApexOptions;
}

export default function ChartsTypeAM({ dataStats }: ChartsTypeAMProps) {
   const { theme } = themeStore();
   const [stateM, setStateM] = useState<StateChart>({
      series: [],
      options: {
         theme: { mode: theme },
         fill: {
            colors: ["#00A600", "#BAC918", "#E000D2", "#FF4242", "#FCA500"],
         },
         labels: [],
         legend: {
            labels: {
               colors: theme === "dark" ? "#FFFFFF" : "#111827",
            },
            formatter: function (legendName, opts) {
               return [
                  legendName,
                  " - ",
                  opts.w.globals.series[opts.seriesIndex],
               ].join("");
            },
         },
         responsive: [
            {
               breakpoint: 800,
               options: {
                  chart: {
                     width: 300,
                  },
                  legend: {
                     position: "bottom",
                  },
               },
            },
         ],
      },
   });
   const [stateA, setStateA] = useState<StateChart>({
      series: [],
      options: {
         fill: {
            colors: ["#00A600", "#BAC918", "#E000D2", "#FF4242", "#FCA500"],
         },
         theme: { mode: theme },
         labels: [],
         legend: {
            labels: {
               colors: theme === "dark" ? "#FFFFFF" : "#111827",
            },
            formatter: function (legendName, opts) {
               return [
                  legendName,
                  " - ",
                  opts.w.globals.series[opts.seriesIndex],
               ].join("");
            },
         },
         responsive: [
            {
               breakpoint: 800,
               options: {
                  chart: {
                     width: 300,
                  },
                  legend: {
                     position: "bottom",
                  },
               },
            },
         ],
      },
   });

   useEffect(() => {
      const getSeriesLabels = () => {
         const seriesA: number[] = [];
         const labelsA: string[] = [];
         const seriesM: number[] = [];
         const labelsM: string[] = [];
         dataStats?.tiposAnime.forEach((tan) => {
            seriesA.push(tan.conteo);
            labelsA.push(tan.nombre);
         });
         dataStats?.tiposManga.forEach((tan) => {
            seriesM.push(tan.conteo);
            labelsM.push(tan.nombre);
         });
         setStateA((prev) => {
            return {
               ...prev,
               series: seriesA,
               options: {
                  ...prev.options,
                  labels: labelsA,
               },
            };
         });
         setStateM((prev) => {
            return {
               ...prev,
               series: seriesM,
               options: {
                  ...prev.options,
                  labels: labelsM,
               },
            };
         });
      };
      getSeriesLabels();
   }, []);

   useEffect(() => {
      const changeColorLabels = () => {
         setStateA((prev) => ({
            ...prev,
            options: {
               ...prev.options,
               theme: {
                  mode: theme,
               },
               legend: {
                  ...prev.options.legend,
                  labels: {
                     colors: theme === "dark" ? "#FFFFFF" : "#111827",
                  },
               },
            },
         }));
         setStateM((prev) => ({
            ...prev,
            options: {
               ...prev.options,
               theme: {
                  mode: theme,
               },
               legend: {
                  ...prev.options.legend,
                  labels: {
                     colors: theme === "dark" ? "#FFFFFF" : "#111827",
                  },
               },
            },
         }));
      };
      changeColorLabels();
   }, [theme]);

   return (
      <div className="flex flex-col md:flex-row w-full p-0 gap-3 items-center">
         {dataStats?.tiposAnime && dataStats.tiposAnime.length > 0 ? (
            <div className="w-full md:w-[60%] items-center flex-col flex">
               <h3 className="text-xl font-semibold text-center">
                  Tipos de Animes
               </h3>
               <div id="chartA">
                  <ReactApexChart
                     options={stateA.options}
                     series={stateA.series}
                     type="pie"
                     width={380}
                  />
               </div>
               <div id="html-dist"></div>
            </div>
         ) : (
            <MessageNoContenido typeCont={1} />
         )}
         {dataStats?.tiposManga && dataStats.tiposManga.length > 0 ? (
            <div className="w-full md:w-[60%] items-center flex-col flex">
               <h3 className="text-xl font-semibold text-center">
                  Tipos de Mangas
               </h3>
               <div id="chartM">
                  <ReactApexChart
                     options={stateM.options}
                     series={stateM.series}
                     type="pie"
                     width={380}
                  />
               </div>
               <div id="html-dist"></div>
            </div>
         ) : (
            <MessageNoContenido typeCont={2} />
         )}
      </div>
   );
}
