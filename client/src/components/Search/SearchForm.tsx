import { Button, TextInput } from "flowbite-react";
import type { FilterObjSchema } from "../../schemas/filtersSchemas";
import {
   useId,
   useState,
   type Dispatch,
   type FormEvent,
   type SetStateAction,
} from "react";
import { Search } from "lucide-react";
import { FiltersSearchForm } from "./FiltersSearchForm";
import {
   FieldOrdEnum,
   TipoContenidoEnum,
   type FilterParamsInterface,
   type OptionsSelectInterface,
   type OptionsSelectStrInterface,
   type OrderByType,
} from "../../types/filterTypes";

interface SearchFormProps {
   filtersParam: FilterParamsInterface;
   setFiltersParam: Dispatch<SetStateAction<FilterParamsInterface>>;
   setPage: Dispatch<SetStateAction<number>>;
   tipoContenido: TipoContenidoEnum;
}

export function SearchForm({
   filtersParam,
   setFiltersParam,
   setPage,
   tipoContenido,
}: SearchFormProps) {
   const [selGenres, setSelGenres] = useState<FilterObjSchema[]>([]);
   const [selStudios, setSelStudios] = useState<FilterObjSchema[]>([]);
   const [selEditoriales, setSelEditoriales] = useState<FilterObjSchema[]>([]);
   const [selAutores, setSelAutores] = useState<FilterObjSchema[]>([]);
   const [selTiposAnime, setSelTiposAnime] = useState<OptionsSelectInterface[]>(
      []
   );
   const [selTiposManga, setSelTiposManga] = useState<OptionsSelectInterface[]>(
      []
   );
   const [selEmision, setSelEmision] = useState<OptionsSelectInterface | null>(
      null
   );
   const [selFieldOrd, setSelFieldOrd] =
      useState<OptionsSelectStrInterface | null>(null);
   const [selOrderBy, setSelOrderBy] =
      useState<OptionsSelectStrInterface | null>(null);
   const [titSearch, setTitSearch] = useState<string>(
      filtersParam.tit_search.trim()
   );
   const idTitSearchInput = useId();

   const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      const arrGenres: number[] = selGenres.map((sg) => sg.code);
      const arrStudios: number[] =
         tipoContenido === TipoContenidoEnum.todos ||
         tipoContenido === TipoContenidoEnum.anime
            ? selStudios.map((ss) => ss.code)
            : [];
      const arrAuthors: number[] =
         tipoContenido === TipoContenidoEnum.todos ||
         tipoContenido === TipoContenidoEnum.manga
            ? selAutores.map((sa) => sa.code)
            : [];
      const arrEditorials: number[] =
         tipoContenido === TipoContenidoEnum.todos ||
         tipoContenido === TipoContenidoEnum.manga
            ? selEditoriales.map((se) => se.code)
            : [];
      const arrTiposAnime: number[] =
         tipoContenido === TipoContenidoEnum.todos ||
         tipoContenido === TipoContenidoEnum.anime
            ? selTiposAnime.map((ta) => ta.code)
            : [];
      const arrTiposManga: number[] =
         tipoContenido === TipoContenidoEnum.todos ||
         tipoContenido === TipoContenidoEnum.manga
            ? selTiposManga.map((tm) => tm.code)
            : [];
      const emision: number = selEmision?.code ?? 3;
      const orderby: OrderByType = selOrderBy?.code
         ? selOrderBy.code === "desc"
            ? "desc"
            : "asc"
         : "asc";
      const orderfield: FieldOrdEnum = (() => {
         const key = (selFieldOrd?.code || "key").trim();
         return Object.prototype.hasOwnProperty.call(FieldOrdEnum, key)
            ? FieldOrdEnum[key as keyof typeof FieldOrdEnum]
            : FieldOrdEnum.key;
      })();

      setFiltersParam((prev) => {
         return {
            ...prev,
            tit_search: titSearch,
            generos: arrGenres,
            estudios: arrStudios,
            autores: arrAuthors,
            editoriales: arrEditorials,
            tiposAnime: arrTiposAnime,
            tiposManga: arrTiposManga,
            emision: emision,
            tipoContenido: tipoContenido,
            orderBy: orderby,
            orderField: orderfield,
         };
      });
      setPage(0);
   };

   const handleClearFilters = () => {
      setSelGenres([]);
      setSelAutores([]);
      setSelEditoriales([]);
      setSelStudios([]);
      setSelEmision(null);
      setSelFieldOrd(null);
      setSelOrderBy(null);
      setSelTiposAnime([]);
      setSelTiposManga([]);
      setTitSearch("");
   };

   return (
      <form role="search" id="formSearch" onSubmit={handleSubmit}>
         <div className="md:flex w-full gap-4 min-w-0 overflow-x-auto">
            <TextInput
               id={idTitSearchInput}
               name="title_search"
               type="text"
               value={titSearch}
               onChange={(e) => setTitSearch(e.target.value)}
               icon={Search}
               className="md:w-[90%] w-full mb-3 min-w-0"
               placeholder="Ingresa el titulo a buscar"
            />
            <Button
               color="purple"
               className="md:w-[10%] w-full mb-3 shrink-0"
               type="submit"
            >
               Buscar
            </Button>
            <Button
               color="purple"
               className="md:w-[10%] w-full mb-3 shrink-0"
               onClick={handleClearFilters}
               outline
            >
               Limpiar Filtros
            </Button>
         </div>
         <FiltersSearchForm
            filtersParam={filtersParam}
            selGenres={selGenres}
            setSelGenres={setSelGenres}
            selStudios={selStudios}
            setSelStudios={setSelStudios}
            selEditoriales={selEditoriales}
            setSelEditoriales={setSelEditoriales}
            selAutores={selAutores}
            setSelAutores={setSelAutores}
            selTiposAnime={selTiposAnime}
            setSelTiposAnime={setSelTiposAnime}
            selTiposManga={selTiposManga}
            setSelTiposManga={setSelTiposManga}
            selEmision={selEmision}
            setSelEmision={setSelEmision}
            selFieldOrd={selFieldOrd}
            setSelFieldOrd={setSelFieldOrd}
            selOrderBy={selOrderBy}
            setSelOrderBy={setSelOrderBy}
            tipoContenido={tipoContenido}
         />
      </form>
   );
}
