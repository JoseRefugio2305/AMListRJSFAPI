import { Breadcrumb, BreadcrumbItem } from "flowbite-react";

type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
   if (!items || items.length === 0) return null;
   return (
      <nav aria-label="Breadcrumb" className="mb-4">
         <Breadcrumb className="mx-auto max-w-[90%]">
            {items.map((it, idx) => {
               return it.to ? (
                  <BreadcrumbItem
                     key={idx}
                     href={it.to}
                     aria-label="Breadcrumb"
                  >
                     <span className="truncate max-w-60 font-semibold hover:underline text-black dark:text-white hover:text-purple-500">
                        {it.label}
                     </span>
                  </BreadcrumbItem>
               ) : (
                  <BreadcrumbItem key={idx} aria-label="Breadcrumb">
                     <span className="truncate max-w-30 md:max-w-80 lg:max-w-96 font-semibold">
                        {it.label}
                     </span>
                  </BreadcrumbItem>
               );
            })}
         </Breadcrumb>
      </nav>
   );
}
