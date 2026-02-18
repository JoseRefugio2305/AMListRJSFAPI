import { Skeleton } from "primereact/skeleton";
import { CarouselSkeleton } from "./CarouselSkeleton";

export function PageSkeleton() {
   return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
         <div className=" items-center">
            <CarouselSkeleton />
            <Skeleton width="100%" height="4rem"></Skeleton>
         </div>
      </div>
   );
}
