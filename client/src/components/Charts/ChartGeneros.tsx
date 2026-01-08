import { useEffect, useState } from "react";
import type {
   FavsCountSchema,
   FullStatsSchema,
} from "../../schemas/statsSchemas";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { themeStore } from "../../store/themeStore";
import { ChartSkeleton } from "../Skeletons/ChartSkeleton";
import { MessageNoContenido } from "../Common/User/MessageNoContenido";

interface ChartGenerosProps {
   dataStats: FavsCountSchema | FullStatsSchema | null;
}

interface StateChart {
   series: { name: string; data: number[] }[];
   options: ApexOptions;
}

export default function ChartGeneros({ dataStats }: ChartGenerosProps) {
   const { theme } = themeStore();
   const [totalAnimes, setTotalAnimes] = useState<number>(0);
   const [totalMangas, setTotalMangas] = useState<number>(0);
   const [heightChart, setHeightChart] = useState<number>(500);
   const [loading, setLoading] = useState<boolean>(true);

   const [state, setState] = useState<StateChart>({
      series: [],
      options: {
         chart: {
            stacked: true,
         },
         colors: ["#F847FC", "#31DEBB"],
         plotOptions: {
            bar: {
               barHeight: "17px",
               horizontal: true,
               dataLabels: {
                  total: {
                     enabled: true,
                     offsetX: 0,
                     style: {
                        fontSize: "15px",
                        fontWeight: 700,
                        color: theme === "light" ? "#000" : "#fff",
                     },
                  },
               },
            },
         },
         theme: { mode: theme },
         legend: {
            position: "top",
         },
         xaxis: {
            categories: [],
         },
      },
   });

   useEffect(() => {
      const getSeriesCat = () => {
         setLoading(true);
         const arrCats: string[] = [];
         const aniSeries: { name: string; data: number[] } = {
            name: "Animes",
            data: [],
         };
         const manSeries: { name: string; data: number[] } = {
            name: "Manga",
            data: [],
         };

         let totAn = 0;
         let totMan = 0;

         dataStats?.conteoGeneros.forEach((gen) => {
            totAn += gen.conteoanimes;
            totMan += gen.conteomangas;
            arrCats.push(gen.nombre);
            aniSeries.data.push(gen.conteoanimes);
            manSeries.data.push(gen.conteomangas);
         });

         setHeightChart(arrCats.length * 19);
         setTotalAnimes(totAn);
         setTotalMangas(totMan);

         setState((prev) => {
            return {
               ...prev,
               series: [aniSeries, manSeries],
               options: {
                  ...prev.options,
                  xaxis: {
                     ...(prev.options as ApexOptions).xaxis,
                     categories: arrCats,
                  },
               },
            };
         });
         setLoading(false);
      };
      getSeriesCat();
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
               plotOptions: {
                  ...((prev.options as ApexOptions).plotOptions ?? {}),
                  bar: {
                     ...(((prev.options as ApexOptions).plotOptions ?? {})
                        .bar ?? {}),
                     dataLabels: {
                        ...((
                           ((prev.options as ApexOptions).plotOptions ?? {})
                              .bar ?? {}
                        ).dataLabels ?? {}),
                        total: {
                           ...(
                              (
                                 (
                                    (prev.options as ApexOptions).plotOptions ??
                                    {}
                                 ).bar ?? {}
                              ).dataLabels ?? {}
                           ).total,
                           style: {
                              ...((
                                 (
                                    (
                                       (prev.options as ApexOptions)
                                          .plotOptions ?? {}
                                    ).bar ?? {}
                                 ).dataLabels ?? {}
                              ).total?.style ?? {}),
                              color: theme === "light" ? "#000" : "#fff",
                           },
                        },
                     },
                  },
               },
            },
         }));
      };
      changeColorLabels();
   }, [theme]);

   return (
      <div className="flex flex-col w-full p-5">
         <div className="w-full">
            {loading ? (
               <ChartSkeleton />
            ) : totalMangas > 0 || totalAnimes > 0 ? (
               <>
                  <h3 className="text-xl font-semibold text-center">
                     Estadísticas de Generos
                  </h3>
                  <div>
                     <div id="chart">
                        <ReactApexChart
                           options={state.options}
                           series={state.series}
                           type="bar"
                           height={heightChart}
                        />
                     </div>
                     <div id="html-dist"></div>
                  </div>
               </>
            ) : (
               <MessageNoContenido typeCont={3} />
            )}
         </div>
      </div>
   );
}
