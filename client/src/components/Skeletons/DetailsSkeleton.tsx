import { Skeleton } from "primereact/skeleton";

export function DetailsSkeleton() {
   return (
      <div className="flex flex-col sm:flex-row w-full p-0">
         <div className="w-full flex flex-col items-center mb-4">
            <Skeleton className="mb-2" width="215px" height="220px"></Skeleton>
            <Skeleton className="mb-2" width="215px" height="30px"></Skeleton>
            <Skeleton className="mb-2" width="215px" height="30px"></Skeleton>
            <Skeleton className="mb-2" width="215px" height="30px"></Skeleton>
            <Skeleton className="mb-2" width="215px" height="30px"></Skeleton>
         </div>
         <div className="w-[80%] mx-auto md:w-full flex flex-col items-center mb-4">
            <Skeleton width="100%" height="30px" className="mb-2"></Skeleton>
            <Skeleton width="100%" height="180px" className="mb-2"></Skeleton>
            <Skeleton width="100%" height="30px" className="mb-2"></Skeleton>
            <Skeleton width="100%" height="30px" className="mb-2"></Skeleton>
            <Skeleton width="100%" height="30px" className="mb-2"></Skeleton>
            <Skeleton width="100%" height="30px" className="mb-2"></Skeleton>
         </div>
         {/* 
         
         <Skeleton
            className="hidden sm:block"
            width="215px"
            height="350px"
         ></Skeleton>
         <Skeleton
            className="hidden sm:block"
            width="215px"
            height="350px"
         ></Skeleton>
         <Skeleton
            className="hidden sm:block"
            width="215px"
            height="350px"
         ></Skeleton> */}
      </div>
   );
}
