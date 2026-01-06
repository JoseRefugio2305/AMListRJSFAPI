import { Skeleton } from "primereact/skeleton";
import { PaginationSkeleton } from "./PaginationSekeleton";

export function SearchSkeleton() {
   return (
      <>
         <Skeleton width="30%" height="2rem"></Skeleton>
         <Skeleton width="30%" height="4rem"></Skeleton>
         <Skeleton width="100%" height="10rem"></Skeleton>
         <PaginationSkeleton />
      </>
   );
}
