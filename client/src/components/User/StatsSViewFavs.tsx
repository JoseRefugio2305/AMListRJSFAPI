import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import type { StatusViewCountSchema } from "../../schemas/statsSchemas";
import { getStatusViewName } from "../../utils/common";
import { parseStringNumber } from "../../utils/parse";

interface StatsSViewFavsProps {
   dataStats: StatusViewCountSchema[];
}

export function StatsSViewFavs({ dataStats }: StatsSViewFavsProps) {
   const COLORS = ["#00A600", "#BAC918", "#E000D2", "#FF4242", "#FCA500"];

   const getLabel = (name: string) => {
      return getStatusViewName(parseStringNumber(name));
   };

   return (
      <PieChart
         className="mx-auto"
         style={{
            width: "100%",
            maxWidth: "500px",
            maxHeight: "30vh",
            aspectRatio: 2,
         }}
         responsive
      >
         <Pie
            dataKey="conteo"
            nameKey="statusView"
            startAngle={180}
            endAngle={0}
            data={dataStats}
            cx="50%"
            cy="100%"
            outerRadius="120%"
            fill="#8884d8"
            labelLine
            label={(e) => `${((e.percent ?? 1) * 100).toFixed(0)}%`}
            isAnimationActive={true}
         >
            {dataStats.map((entry) => (
               <Cell
                  key={`cell-${entry.statusView}`}
                  fill={COLORS[entry.statusView - 1]}
               />
            ))}
            <Tooltip
               content={(e) => (
                  <div className="w-full h-fit p-3 border rounded-sm bg-gray-300 dark:bg-gray-700">{`${getLabel(
                     e.payload[0]?.name
                  )}: ${e.payload[0]?.value}`}</div>
               )}
            />
            <Legend
               formatter={(value) => (
                  <span className="text-sm font-bold">
                     {`${getLabel(value)}`}
                  </span>
               )}
            />
         </Pie>
      </PieChart>
   );
}
