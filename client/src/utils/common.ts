export function cutText(text: string, length_text: number = 35) {
     return text.length > length_text ? text.substring(0, length_text) + "..." : text
}

export function getDayEmision(fechaemision: string) {
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