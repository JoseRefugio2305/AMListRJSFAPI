import { useEffect, useRef, useState, useMemo } from "react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
   src: string;
   alt: string;
   fallbackSrc?: string;
   className?: string;
}

export function LazyLoadImage({
   src,
   alt,
   fallbackSrc = "/default_image.jpg",
   className = "",
   ...rest
}: LazyImageProps) {
   const imgRef = useRef<HTMLImageElement | null>(null);
   const [isVisible, setIsVisible] = useState(false);
   const [loaded, setLoaded] = useState(false);
   const [forceFallback, setForceFallback] = useState(false);
   const triedFallbackRef = useRef(false);

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

   // Normaliza fallback a URL absoluta para comparaciones fiables
   const fallbackAbsolute = useMemo(
      () => new URL(fallbackSrc, window.location.href).href,
      [fallbackSrc]
   );

   // Deriva el src a usar sin setState dentro de un efecto para evitar renders en cascada
   const initialSrc = useMemo(() => {
      if (!isVisible) return undefined;
      try {
         return new URL(src, window.location.href).href;
      } catch {
         return fallbackAbsolute;
      }
   }, [isVisible, src, fallbackAbsolute]);

   const srcToUse = forceFallback ? fallbackAbsolute : initialSrc;

   const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      // const target = e.currentTarget;
      // Evita reasignar fallback más de una vez para romper bucles
      if (!triedFallbackRef.current) {
         triedFallbackRef.current = true;
         setForceFallback(true);
      }
   };

   return (
      <img
         ref={imgRef}
         src={isVisible ? srcToUse : undefined}
         alt={alt}
         loading="lazy"
         onLoad={() => setLoaded(true)}
         onError={handleError}
         className={`transition-all duration-700 ${
            loaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
         } ${className}`}
         {...rest}
      />
   );
}
