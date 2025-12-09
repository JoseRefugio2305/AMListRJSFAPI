import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";
import { toastStore } from "../../store/toastStore";

export function ToastNotif() {
   const toast = useRef<Toast>(null);
   const message = toastStore((s) => s.message);
   //    const clearToast = toastStore((s) => s.clearToast);

   useEffect(() => {
      if (message) {
         toast.current?.show({
            severity: message.severity,
            summary: message.summary,
            detail: message.detail,
         });
         //     clearToast();
      }
   }, [message]);

   return (
      <div className="card flex justify-content-center">
         <Toast ref={toast} position="bottom-right" />
      </div>
   );
}
