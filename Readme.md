# AniMangaList

## ¿Qué es AniMangaList?

**AniMangaList** es una plataforma web full-stack diseñada para otakus y entusiastas del anime/manga que desean:

- **Gestionar su biblioteca personal** de animes y mangas consumidos
- **Descubrir nuevos títulos** mediante búsqueda avanzada con filtros (género, tipo, estado)
- **Organizar favoritos** y seguir el progreso de visualización/lectura
- **Analizar estadísticas** de consumo (géneros preferidos, tiempo invertido, tendencias)
- **Integración con MyAnimeList (MAL)** para importar información actualizada de títulos

[Click en las siguientes imágenes para ver un clip de la ejecución del Proyecto en YouTube](https://youtu.be/dPWxWPQ5xxg)

[![Clip del Proyecto](./assets/captura.png)](https://youtu.be/dPWxWPQ5xxg "Clip del Proyecto")

## Problema que Resuelve

Los usuarios de anime/manga suelen tener colecciones dispersas en múltiples plataformas (MAL, AniList, notas personales, etc.). AniMangaList centraliza toda esta información en una interfaz única, moderna y personalizable, permitiendo:

- Control total sobre tus datos (self-hosted)
- Búsquedas y filtros potentes
- Estadísticas visuales de tus hábitos de consumo
- Gestión sin límites de títulos o listas

## Stack Tecnológico

>[!NOTE]
> Las documentaciones detalladas de cada proyecto se encuentran en sus respectivos directorios.

**Backend:**
- FastAPI (Python) - API REST asíncrona
- MongoDB + Beanie ODM - Base de datos NoSQL con ODM tipado
- Redis - Caché y gestión de tareas en background

**Frontend:**
- React 19 + TypeScript - UI declarativa con type safety
- Vite - Build tool ultrarrápido
- Tailwind CSS - Estilos utility-first
- Zustand - Estado global minimalista
- React Router 7 - Navegación
- Zod - Validación de formularios

**DevOps & Tools:**
- Docker - Containerización
- GitHub Actions - CI/CD
- Pytest + Vitest - Testing
- ESLint + Prettier - Linting