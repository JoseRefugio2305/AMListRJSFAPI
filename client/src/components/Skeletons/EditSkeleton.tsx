import { Skeleton } from "primereact/skeleton";

export function EditSkeleton() {
   return (
      <>
         <div className="border-round surface-border p-4 surface-card gap-5 flex flex-col">
            <Skeleton
               height="50px"
               className="w-full  md:w-[40%] h-[30px]"
            ></Skeleton>
            <Skeleton
               height="50px"
               className="w-full  md:w-[40%] h-[30px]"
            ></Skeleton>
            <Skeleton
               height="100px"
               className="w-full  md:w-[40%] h-[30px]"
            ></Skeleton>
            <div className="flex flex-col md:flex-row gap-4">
               {" "}
               <Skeleton
                  height="50px"
                  className="w-full  md:w-[40%] h-[30px]"
               ></Skeleton>
               <Skeleton
                  height="50px"
                  className="w-full  md:w-[40%] h-[30px]"
               ></Skeleton>
            </div>
            <Skeleton
               height="50px"
               className="w-full  md:w-[40%] h-[30px]"
            ></Skeleton>
         </div>
      </>
   );
}
