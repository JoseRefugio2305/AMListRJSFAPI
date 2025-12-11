export default function NotFoundPage() {
   return (
      <main className="min-h-screen flex items-center justify-center bg-transparent">
         <div className="max-w-5xl w-full flex flex-col items-center px-5">
            <h1 className="text-3xl font-bold underline text-center">
               404 - Página  no encontrada
            </h1>
            <img
               alt="Not Found 404"
               src="/404_not_found.png"
               className="w-[30%] mx-auto"
            />
            <p className="text-xl font-bold text-center">
               Lo sentimos, la página que buscas no existe.
            </p>
         </div>
      </main>
   );
}
