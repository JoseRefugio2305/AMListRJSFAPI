import { ModalBody, ModalHeader, XIcon } from "flowbite-react";
import type { ModalProps } from "./ModalFormCreate";
import { useRef, useState } from "react";
import {
   FileUpload,
   type FileUploadHandlerEvent,
   type FileUploadHeaderTemplateOptions,
   type FileUploadSelectEvent,
   type ItemTemplateOptions,
} from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Tooltip } from "primereact/tooltip";
import {
   CloudUploadIcon,
   FileBracesIcon,
   FileUpIcon,
   FolderOpenIcon,
} from "lucide-react";
import { toastStore } from "../../../store/toastStore";
import { uploadFileAnimes } from "../../../services/dashboardAnimeServides";
import { AnimeFileZ } from "../../../schemas/animeSchemas";

export default function ModalFormFile({ setOpenModal }: ModalProps) {
   const showToast = toastStore((s) => s.showToast);
   const [totalSize, setTotalSize] = useState(0);
   const [loading, setLoading] = useState<boolean>(false);
   const fileUploadRef = useRef<FileUpload>(null);

   const onTemplateSelect = (e: FileUploadSelectEvent) => {
      let _totalSize = totalSize;
      const files = e.files;

      for (let i = 0; i < files.length; i++) {
         _totalSize += files[i].size || 0;
      }

      setTotalSize(_totalSize);
   };

   const onTemplateClear = () => {
      setTotalSize(0);
   };

   const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
      const { className, chooseButton, uploadButton, cancelButton } = options;
      const value = totalSize / 10000;
      const formatedValue =
         fileUploadRef && fileUploadRef.current
            ? fileUploadRef.current.formatSize(totalSize)
            : "0 B";

      return (
         <div
            className={className}
            style={{
               backgroundColor: "transparent",
               display: "flex",
               alignItems: "center",
            }}
         >
            {chooseButton}
            {uploadButton}
            {cancelButton}
            <div className="flex align-items-center gap-3 ml-auto">
               <span>{formatedValue} / 1 MB</span>
               <ProgressBar
                  value={value}
                  showValue={false}
                  style={{ width: "10rem", height: "12px" }}
               ></ProgressBar>
            </div>
         </div>
      );
   };

   const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
      const file = inFile as File;
      return (
         <div className="flex justify-center flex-col items-center md:flex-row gap-4">
            <div className="flex flex-col md:flex-row justify-center gap-4">
               <FileBracesIcon size={64} />
               <span className="flex flex-col text-left ml-3">
                  <p>{file.name}</p>
                  <small>{new Date().toLocaleDateString()}</small>
               </span>
            </div>
            <h5
               className={`h-fit w-fit font-bold text-white rounded-2xl p-1 bg-orange-500`}
            >
               {props.formatSize}
            </h5>
         </div>
      );
   };

   const emptyTemplate = () => {
      return (
         <div className="flex flex-col items-center">
            <FileBracesIcon size={64} />
            <span
               style={{
                  fontSize: "1.2em",
                  color: "var(--text-color-secondary)",
               }}
               className="my-5"
            >
               Arrastra y Suelta el Archivo
            </span>
         </div>
      );
   };

   const loadTemplate = () => {
      return (
         <div className="flex flex-col items-center">
            <FileUpIcon size={64} />
            <span
               style={{
                  fontSize: "1.2em",
                  color: "var(--text-color-secondary)",
               }}
               className="my-5"
            >
               Subiendo Archivo. Espera un momento
            </span>
         </div>
      );
   };

   const chooseOptions = {
      icon: <FolderOpenIcon />,
      iconOnly: true,
      className: "custom-choose-btn p-button-rounded p-button-outlined",
   };
   const uploadOptions = {
      icon: <CloudUploadIcon />,
      iconOnly: true,
      className:
         "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
   };
   const cancelOptions = {
      icon: <XIcon />,
      iconOnly: true,
      className:
         "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
   };

   const handleUpload = async (event: FileUploadHandlerEvent) => {
      const file = event.files[0];

      if (file.type !== "application/json") {
         showToast({
            severity: "error",
            summary: "Error",
            detail: "El archivo debe ser un JSON.",
         });
         return;
      }
      setLoading(true);

      //  const reader = new FileReader();
      //  const blob = await fetch(file.objectURL).then((r) => r.blob());

      //  reader.readAsDataURL(blob);

      //  reader.onloadend = function () {
      //     const base64data = reader.result;
      //     console.log(base64data);
      //  };
      const parsed = AnimeFileZ.safeParse({ file });
      if (!parsed.success) {
         showToast({
            severity: "error",
            summary: "Error",
            detail: parsed.error.issues[0].message,
         });
         setLoading(false);
         return;
      }
      uploadFileAnimes(parsed.data).then((resp) => {
         if (!resp.is_success) {
            showToast({
               severity: "error",
               summary: "Error",
               detail: resp.message,
            });
         } else {
            showToast({
               severity: "success",
               summary: "Exito",
               detail: `${resp.message}\nHabía ${resp.totalToAct} animes para insertar desde el archivo.\nSe insertaron ${resp.totalAct} animes.`,
            });
            setTotalSize(0);
            setOpenModal(false);
         }
         setLoading(false);
      });
   };

   return (
      <>
         <ModalHeader>Subir Archivo de Animes</ModalHeader>
         <ModalBody>
            {loading ? (
               loadTemplate()
            ) : (
               <div className="space-y-6">
                  <Tooltip
                     target=".custom-choose-btn"
                     content="Seleccionar"
                     position="bottom"
                  />
                  <Tooltip
                     target=".custom-upload-btn"
                     content="Subir"
                     position="bottom"
                  />
                  <Tooltip
                     target=".custom-cancel-btn"
                     content="Limpiar"
                     position="bottom"
                  />
                  <FileUpload
                     ref={fileUploadRef}
                     name="fileAnimesJson"
                     customUpload
                     uploadHandler={handleUpload}
                     accept="application/json"
                     maxFileSize={1000000}
                     onSelect={onTemplateSelect}
                     onError={onTemplateClear}
                     onClear={onTemplateClear}
                     headerTemplate={headerTemplate}
                     itemTemplate={itemTemplate}
                     emptyTemplate={emptyTemplate}
                     chooseOptions={chooseOptions}
                     uploadOptions={uploadOptions}
                     cancelOptions={cancelOptions}
                  />
               </div>
            )}
         </ModalBody>
      </>
   );
}
