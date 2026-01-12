import { Skeleton } from "primereact/skeleton";

export function SearchMALSkeleton(){
     return <div className="border-round surface-border p-4 surface-card gap-5 flex flex-col">
              <Skeleton
                 height="50px"
                 className="w-full  md:w-[40%] h-[30px]"
              ></Skeleton>
              <Skeleton
                 height="50px"
                 className="w-full  md:w-[40%] h-[30px]"
              ></Skeleton>
              <Skeleton
                 height="50px"
                 className="w-full  md:w-[40%] h-[30px]"
              ></Skeleton>
              <Skeleton
                 height="50px"
                 className="w-full  md:w-[40%] h-[30px]"
              ></Skeleton>
              <Skeleton
                 height="50px"
                 className="w-full  md:w-[40%] h-[30px]"
              ></Skeleton>
           </div>
}