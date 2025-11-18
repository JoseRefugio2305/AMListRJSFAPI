from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from app.core.database import connect_mongo, close_mongo
from app.routers import (
    auth_router,
    anime_router,
    manga_router,
    search_router,
    user_router,
    dashboard,
)
from app.core.logging import get_logger

logger = get_logger(__name__)


@asynccontextmanager
# Lifespan donde manejaremos el ciclo de vida de la placiacion (inicio a cierre)
async def lifespan(app: FastAPI):
    try:
        logger.info("Inicializando aplicación")
        await connect_mongo()  # Iniciamos conexion a mongodb
        yield  # Ejecucion de la aplicacion
    except Exception as e:
        logger.error(
            f"Ocurrió un erro critico en la aplicación: ({str(e)}))", exc_info=True
        )
        raise e
    finally:
        logger.info("Finalizando aplicación")
        await close_mongo()  # Cerramos conexion a mongodb


app = FastAPI(
    title="Anime y Manga FastAPI",
    description="Esta será el API del servicio de Anime y Manga construida en FastAPI con mongoDB como base de datos",
    version="1.0.0",
    lifespan=lifespan,  # gregamos el lifespan
)


# Ruta root
@app.get("/")
async def root():
    return {"status": "ok", "message": "Anime & Manga API corriendo"}


# Registro de rutas
app.include_router(auth_router.routerAuth)
app.include_router(anime_router.routerAnime)
app.include_router(manga_router.routerManga)
app.include_router(search_router.routerSearch)
app.include_router(user_router.routerUser)
app.include_router(dashboard.routerDashboard)
app.include_router(dashboard.routerDashAnime)
app.include_router(dashboard.routerDashManga)


# Manejador de excepciones HTTP
@app.exception_handler(HTTPException)
async def http_excp_handler(request: Request, exc: HTTPException):
    logger.error(
        f"Código de error: {exc.status_code} -> {str(exc.detail)}", exc_info=True
    )
    return JSONResponse(status_code=exc.status_code, content={"message": exc.detail})


# Manejador de excepciones generales
@app.exception_handler(Exception)
async def generic_excp_handler(request: Request, exc: Exception):
    logger.error(f"Código de error: 500 -> {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "message": "Ha ocurrido un error interno en el servidor",
        },
    )
