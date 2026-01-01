import { StatusViewEnum, TipoAnimeEnum } from "../types/animeTypes";
import { TipoContenidoEnum } from "../types/filterTypes";
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

export function getMangaStrType(tipo: TipoMangaEnum): string {
     switch (tipo) {
          case TipoMangaEnum.NL:
               return "Novela Ligera";
          case TipoMangaEnum.One_Shot:
               return "One Shot";
          default:
               return TipoMangaEnum[tipo];
     }
}

export function getStatusViewName(status: StatusViewEnum): string {
     return StatusViewEnum[status]
}

export function getColorTipoAnimeManga(tipo: TipoAnimeEnum | TipoMangaEnum, is_emision: number) {
     if (is_emision === 1) {
          return "bg-green-500";
     }
     let colorbg: string = "bg-blue-500";
     switch (tipo) {
          case TipoAnimeEnum.Anime || TipoMangaEnum.Manga:
               colorbg = "bg-pink-500";
               break;
          case TipoAnimeEnum.OVA || TipoMangaEnum.NL:
               colorbg = "bg-fuchsia-500";
               break;
          case TipoAnimeEnum.Pelicula || TipoMangaEnum.Manhwa:
               colorbg = "bg-orange-500";
               break;
          case TipoAnimeEnum.Donghua || TipoMangaEnum.One_Shot:
               colorbg = "bg-red-500";
               break;
          case TipoAnimeEnum.Especial || TipoMangaEnum.Manhua:
               colorbg = "bg-violet-500";
               break;
          default:
               break;
     }

     return colorbg;
}

export function getStatusViewStr(statusView: StatusViewEnum, is_anime: boolean): string {
     if (!is_anime && statusView === StatusViewEnum.Viendo) {
          return "Leyendo";
     }
     const str_status: string = StatusViewEnum[statusView];
     return str_status;
}

export function getTitleForLink(title: string): string {


     return title
          .normalize('NFKD') // descompone acentos en base + diacríticos, esta normalizacion decompone por ejemplo, í en i´
          .replace(/[\u0300-\u036f]/g, '') // quita diacríticos
          .toLowerCase()
          .replace(/[^\p{L}\p{N}-]+/gu, '-') // conserva letras, números y guiones; cambia resto a '-'
          .replace(/^-+|-+$/g, '') // quita guiones al inicio/fin
          .replace(/-{2,}/g, '-'); // colapsa guiones múltiples
}

export function getTipoContenido(estudiosL: number, editorialesL: number, autoresL: number, tiposAnimeL: number, tiposMangaL: number): TipoContenidoEnum {

     if ((tiposAnimeL > 0 || estudiosL > 0) && (tiposMangaL === 0 && editorialesL === 0 && autoresL === 0)) return TipoContenidoEnum.anime
     if ((tiposMangaL > 0 || editorialesL > 0 || autoresL > 0) && (tiposAnimeL === 0 && estudiosL === 0)) return TipoContenidoEnum.manga

     return TipoContenidoEnum.todos
}