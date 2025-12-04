import type { AxiosError } from "axios";

interface ErrorResponse {
     message: string;
     detail?: Array<{ msg: string }>;
}

export function getMessageError(error: AxiosError<ErrorResponse>): string {
     let message = "Error al procesar la petición"
     if (error?.response?.data.detail && error?.response?.data.detail.length > 0) {
          message = error?.response?.data.detail[0].msg
     } else if (error?.response?.data.message) {
          message = error?.response?.data.message
     }
     return message
}