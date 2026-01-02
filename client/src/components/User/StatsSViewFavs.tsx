import type { StatusViewCountSchema } from "../../schemas/statsSchemas";
import { getStatusViewName } from "../../utils/common";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { themeStore } from "../../store/themeStore";

interface StatsSViewFavsProps {
   dataStats: StatusViewCountSchema[];
   areAnimes: boolean;
}

interface StateChart {
   series: number[];
   options: ApexOptions;
}

export function StatsSViewFavs({ dataStats, areAnimes }: StatsSViewFavsProps) {
   const theme = themeStore((s) => s.theme);

   const [state, setState] = useState<StateChart>({
      series: dataStats.map((stat) => stat.conteo),
      options: {
         labels: dataStats.map((stat) =>
            getStatusViewName(stat.statusView, areAnimes)
         ),
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
         plotOptions: {
            pie: {
               startAngle: -90,
               endAngle: 90,
               offsetY: 10,
            },
         },
         grid: {
            padding: {
               bottom: -150,
            },
         },
         responsive: [
            {
               breakpoint: 480,
               options: {
                  chart: {
                     width: 300,
                  },
                  legend: {
                     position: "bottom",
                  },
                  grid: {
                     padding: {
                        bottom: -100,
                     },
                  },
               },
            },
         ],
         fill: {
            colors: ["#00A600", "#BAC918", "#E000D2", "#FF4242", "#FCA500"],
         },
      },
   });

   useEffect(() => {
      const changeColorLabels = () => {
         const legendColor = theme === "dark" ? "#FFFFFF" : "#111827";
         setState((prev) => ({
            ...prev,
            options: {
               ...prev.options,
               legend: {
                  ...(prev.options as ApexOptions).legend,
                  labels: { colors: legendColor },
               },
            },
         }));
      };
      changeColorLabels();
   }, [theme]);

   return (
      <div className="w-full flex justify-center items-center">
         <div id="chart">
            <ReactApexChart
               options={state.options}
               series={state.series}
               type="pie"
               width={500}
            />
         </div>
         <div id="html-dist"></div>
      </div>
   );
}
