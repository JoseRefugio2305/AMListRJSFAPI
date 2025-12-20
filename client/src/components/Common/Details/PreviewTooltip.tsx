import { LazyLoadImage } from "../LazyLoadImage";

interface TooltipProps {
   type_rel: string;
   image: string;
   title: string;
}

export function PreviewTooltip({ type_rel, image, title }: TooltipProps) {
   return (
      <div className="flex flex-row gap-4 rounded-2xl">
         <LazyLoadImage src={image} alt={title} />
         <div>
            <p>{title}</p>
            <p>Tipo: {type_rel}</p>
         </div>
      </div>
   );
}
