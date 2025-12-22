import { useMemo } from "react";
import { AdpRelLink } from "../../Common/Details/AdpRelLink";
import type {
   AnimeCompleteSchema,
   AnimeRelAdpSchema,
} from "../../../schemas/animeSchemas";

interface AnimeRelationsSection {
   relations: AnimeCompleteSchema["relaciones"];
}

export function AnimeRelationsSection({ relations }: AnimeRelationsSection) {
   const hasAny = useMemo(() => {
      return relations.some(
         (r) => Array.isArray(r?.animes) && r?.animes.length > 0
      );
   }, [relations]);

   if (!hasAny) return null;

   const getLinks = (type_rel: string, animes: AnimeRelAdpSchema[]) => {
      return animes.map((ani) => (
         <AdpRelLink
            key={ani.id_MAL}
            is_anime={true}
            title={ani.titulo}
            key_am={ani.key_anime}
            image={ani.animeImages.img_sm}
            type_rel={type_rel}
         />
      ));
   };

   return (
      <div className="shadow-2xl rounded-2xl p-5 bg-white dark:bg-gray-700">
         <h2 className="text-lg font-bold">Animes Relacionados</h2>
         <div className="flex flex-row flex-wrap">
            {relations.map((rel) => getLinks(rel.type_rel, rel.animes))}
         </div>
      </div>
   );
}
