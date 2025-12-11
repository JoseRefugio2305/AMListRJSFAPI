import { TipoAnimeEnum } from "../types/animeTypes";
import { TipoMangaEnum } from "../types/mangaTypes";

export function cutText(text: string, length_text: number = 35): string {
     return text.length > length_text ? text.substring(0, length_text) + "..." : text
}

export function getDayEmision(fechaemision: string): string {
     const week_days = [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
     ];
     const date_em = new Date(fechaemision);
     const day = date_em.getDay();

     return week_days[day];
};

export function getAnimeStrType(tipo: TipoAnimeEnum): string {
     const tipo_anime: string = TipoAnimeEnum[tipo]
     return tipo_anime
}

export function getColorTipoAnimeManga(tipo: TipoAnimeEnum | TipoMangaEnum, is_emision: number) {
     if (is_emision === 1) {
          return "bg-green-500";
     }
     let colorbg: string = "bg-blue-500";
     switch (tipo) {
          case TipoAnimeEnum.Anime || TipoMangaEnum.manga:
               colorbg = "bg-pink-500";
               break;
          case TipoAnimeEnum.OVA || TipoMangaEnum.nl:
               colorbg = "bg-fuchsia-500";
               break;
          case TipoAnimeEnum.Pelicula || TipoMangaEnum.manhwa:
               colorbg = "bg-orange-500";
               break;
          case TipoAnimeEnum.Donghua || TipoMangaEnum.one_shot:
               colorbg = "bg-red-500";
               break;
          case TipoAnimeEnum.Especial || TipoMangaEnum.manhua:
               colorbg = "bg-violet-500";
               break;
          default:
               break;
     }

     return colorbg;
};