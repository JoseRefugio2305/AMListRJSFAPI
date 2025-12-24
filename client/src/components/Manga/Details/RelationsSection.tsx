import { useMemo } from "react";
import { AdpRelLink } from "../../Common/Details/AdpRelLink";
import type { MangaCompleteSchema } from "../../../schemas/mangaSchemas";
import type { MangaRelAdpSchema } from "../../../schemas/relationsSchemas";

interface MangaRelationsSection {
   relations: MangaCompleteSchema["relaciones"];
}

export function MangaRelationsSection({ relations }: MangaRelationsSection) {
   const hasAny = useMemo(() => {
      return relations.some(
         (r) => Array.isArray(r?.mangas) && r?.mangas.length > 0
      );
   }, [relations]);

   if (!hasAny) return null;

   const getLinks = (type_rel: string, mangas: MangaRelAdpSchema[]) => {
      return mangas.map((manga) => (
         <AdpRelLink
            key={manga.id_MAL}
            is_anime={false}
            title={manga.titulo}
            key_am={manga.key_manga}
            image={manga.mangaImages.img_sm}
            type_rel={type_rel}
         />
      ));
   };

   return (
      <div className="shadow-2xl rounded-2xl p-5 bg-white dark:bg-gray-700">
         <h2 className="text-lg font-bold">Mangas Relacionados</h2>
         <div className="flex flex-row flex-wrap">
            {relations.map((rel) => getLinks(rel.type_rel, rel.mangas))}
         </div>
      </div>
   );
}
