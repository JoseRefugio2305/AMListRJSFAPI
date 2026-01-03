import { Skeleton } from "primereact/skeleton";

export function ChartSkeleton() {
   return (
      <div className="w-full flex flex-col justify-start bg-gray-300 dark:bg-gray-700 p-[3%] rounded-2xl">
         <Skeleton width="100%" className="mb-2"></Skeleton>
         <Skeleton width="100%" className="mb-2"></Skeleton>
         <Skeleton width="5rem" className="mb-2"></Skeleton>
         <Skeleton width="3rem" className="mb-2"></Skeleton>
         <Skeleton width="5rem" className="mb-2"></Skeleton>
         <Skeleton width="50%" className="mb-2"></Skeleton>
         <Skeleton  width="100%" className="mb-2"></Skeleton>
      </div>
   );
}
