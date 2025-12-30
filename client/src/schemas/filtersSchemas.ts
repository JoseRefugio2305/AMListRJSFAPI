import * as z from "zod";

export const FilterObjRawZ=z.object({id_MAL: z.number(), nombre: z.string()})

export const FilterObjZ = FilterObjRawZ.transform(({ id_MAL, nombre }) => ({
  code: id_MAL,
  name: nombre
}));

export const FiltersAdvancedSearchZ = z.object({
     genresList: z.array(FilterObjZ).default([]),
     studiosList: z.array(FilterObjZ).default([]),
     autoresList: z.array(FilterObjZ).default([]),
     editorialesList: z.array(FilterObjZ).default([]),
});

export type FiltersAdvancedSearchSchema = z.infer<typeof FiltersAdvancedSearchZ>
export type FilterObjSchema=z.infer<typeof FilterObjZ>