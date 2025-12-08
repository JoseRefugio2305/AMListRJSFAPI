import { Skeleton } from "primereact/skeleton";

export function CarouselSkeleton() {
   return (
      <div className="border-round surface-border p-4 surface-card gap-5 flex flex-row">
         <Skeleton width="215px" height="350px"></Skeleton>
         <Skeleton width="215px" height="350px"></Skeleton>
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
         ></Skeleton>
      </div>
   );
}
