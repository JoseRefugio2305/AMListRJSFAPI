import { useEffect, useRef, useState } from "react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
   src: string;
   alt: string;
   fallbackSrc?: string;
   className?: string;
}

export function LazyLoadImage({
   src,
   alt,
   fallbackSrc = "./default_image.jpg",
   className = "",
   ...rest
}: LazyImageProps) {
   const imgRef = useRef<HTMLImageElement | null>(null);
   const [isVisible, setIsVisible] = useState(false);
   const [loaded, setLoaded] = useState(false);

   useEffect(() => {
      const el = imgRef.current;
      if (!el) return;

      const observer = new IntersectionObserver(
         (entries) => {
            entries.forEach((entry) => {
               if (entry.isIntersecting) {
                  setIsVisible(true);
                  observer.disconnect();
               }
            });
         },
         { threshold: 0.1 } //Se muestra en caso de que el componente este visible en pantalla al menos en un 10%
      );

      observer.observe(el);
      return () => observer.disconnect();
   }, []);

   const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.currentTarget;
      if (target.src !== fallbackSrc) {
         target.src = fallbackSrc; //Imagen por defecto de error
      }
   };

   return (
      <img
         ref={imgRef}
         src={isVisible ? src : undefined}
         alt={alt}
         onLoad={() => setLoaded(true)}
         onError={handleError}
         className={`
        transition-all duration-700
        ${loaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"}
        ${className}
      `}
         {...rest}
      />
   );
}
