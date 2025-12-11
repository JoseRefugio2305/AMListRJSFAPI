import { Skeleton } from "primereact/skeleton";
import { CarouselSkeleton } from "./CarouselSkeleton";

export function PaginationSkeleton() {
   return (
      <div className=" items-center">
         <CarouselSkeleton />
         <Skeleton width="100%" height="4rem"></Skeleton>
      </div>
   );
}
