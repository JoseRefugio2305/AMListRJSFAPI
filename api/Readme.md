# API AMList

Esta es una API para el almacenamiento y listado de anime y manga. Desarrollada en **[FastApi](https://fastapi.tiangolo.com/)** de **Python**, con **[MongoDB](https://www.mongodb.com/)** como base de datos y haciendo uso del el API no oficial de **[My Anime List](https://myanimelist.net/)**, **[Jikan API](https://jikan.moe/)**.

Permite a un usuario sin autenticación la consulta de anime y manga, y de tener autenticación permite el agregar a favoritos anime y manga, y realizar operaciones de edición de perfil. Si tiene la autorización necesaria de administrador, permite además la creación, actualización (con información específica o a través de información obtenida desde My Anime List) y eliminación de anime y manga.

## Estructura del proyecto

```bash
api/
└── app/
    ├── base/
    │   └── base_odm.py
    │
    ├── core/
    │   ├── config/
    │   │   ├── config.py
    │   │   └── __init__.py
    │   │
    │   ├── database/
    │   │   ├── connection.py
    │   │   ├── __init__.py
    │   │   └── helpers/
    │   │       ├── db_helpers.py
    │   │       ├── stats_db_helpers.py
    │   │       ├── anime_helpers.py
    │   │       └── manga_helpers.py
    │   │
    │   ├── logging/
    │   │   ├── logger.py
    │   │   └── __init__.py
    │   │
    │   ├── security/
    │   │   ├── jwt_handler.py
    │   │   ├── roles.py
    │   │   └── __init__.py
    │   │
    │   └── utils/
    │       ├── time_utils.py
    │       ├── validations.py
    │       └── __init__.py
    │
    ├── models/
    │   ├── anime_model.py
    │   ├── author_model.py
    │   ├── editorial_model.py
    │   ├── genero_model.py
    │   ├── manga_model.py
    │   ├── studio_model.py
    │   ├── user_model.py
    │   ├── utafavs_model.py
    │   └── utmanfavs_model.py
    │
    ├── routers/
    │   ├── auth_router.py
    │   ├── anime_router.py
    │   ├── manga_router.py
    │   ├── user_router.py
    │   ├── search_router.py
    │   └── dashboard/
    │       ├── dashboard_router.py
    │       ├── dashboard_anime_router.py
    │       ├── dashboard_manga_router.py
    │       └── __init__.py
    │
    ├── schemas/
    │   ├── anime/
    │   │   ├── anime_schema.py
    │   │   ├── anime_fav.py
    │   │   ├── anime_enums.py
    │   │   └── __init__.py
    │   │
    │   ├── manga/
    │   │   ├── manga_schema.py
    │   │   ├── manga_fav.py
    │   │   ├── manga_enums.py
    │   │   └── __init__.py
    │   │
    │   ├── common/
    │   │   ├── genres.py
    │   │   ├── images.py
    │   │   ├── relations.py
    │   │   └── __init__.py
    │   │
    │   ├── auth/
    │   │   ├── auth_schema.py
    │   │   ├── user_schema.py
    │   │   └── __init__.py
    │   │
    │   ├── stats/
    │   │   ├── stats_schemas.py
    │   │   └── __init__.py
    │   │
    │   └── search/
    │       ├── filters_enum.py
    │       ├── filters_schema.py
    │       ├── search_schema.py
    │       └── __init__.py
    │
    ├── services/
    │   ├── anime/
    │   │   ├── anime_service.py
    │   │   ├── anime_utils.py
    │   │   ├── anime_crud_service.py
    │   │   ├── anime_jikan_service.py
    │   │   ├── anime_file_service.py
    │   │   └── __init__.py
    │   │
    │   ├── manga/
    │   │   ├── manga_service.py
    │   │   ├── manga_utils.py
    │   │   ├── manga_crud_service.py
    │   │   ├── manga_jikan_service.py
    │   │   ├── manga_file_service.py
    │   │   └── __init__.py
    │   │
    │   ├── user_services.py
    │   ├── stats_service.py
    │   ├── auth_service.py
    │   ├── jikan_service.py
    │   └── __init__.py
    │
    └── main.py
```

## Getting Started

Las siguientes instrucciones son para la instalación y ejecución del API.


### Prerrequisitos

-  Python 3.13+
-  MongoDB (Local o con Atlas)

### Instalación

1. **Crear y activar el entorno virtual de Python**

   Una vez clonado el proyecto dentro del directorio api/:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Instalar las dependencias requeridas**
   ```bash
   pip install -r requirements.txt
   ```
3. **Configuración de las variables de entorno**

   Crea el archivo **_`.env`_** en la ruta /api y agrega las siguientes propiedades.

   ```bash
   MONGO_URI=mingo_uri
   MONGO_DB_NAME=mongo_db_name
   JWT_SECRET=jwt_secret
   JWT_ALGORITHM=jwt_algorithm
   ACCESS_TOKEN_EXPIRE_MINUTES=10080
   LOG_LEVEL = DEBUG
   ```

   Reemplaza el valor de las variables con las que usaras en el proyecto.

#### Sobre la base de datos

Si no se tiene una base de datos, esta será creada por mongo al intentar insertar o leer información. También se puede llevar a cabo la restauración de la base de datos a partir de un respaldo previo basándote en el siguiente tutorial: [Exportar e importar de MongoDB - Database tools - mongodump y mongorestore](https://youtu.be/hg8OKEhjwUk?si=Dk9Jh0-S6BYdSb0w)

#### Sobre Jikan Api
Para este proyecto se hizo uso de la API NO Oficial de My Anime List, **_[Jikan API]( https://jikan.moe/)_**, en específico su integración con Python **_[jikan4snek]( https://github.com/ScathachGrip/jikan4snek)_**.
Con la cual se hace la actualización de los animes y mangas con data obtenida desde esta página. 

## Uso

Como ejecutar el proyecto

### Ejecución de la aplicación

Para iniciar la aplicación hay que ejecutar el siguiente comando en la terminal

```bash
uvicorn app.main:app --reload
```

o

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

para poder acceder a ella desde otros disposivos en la misma red.

Esto dejara el api disponible en la ruta **`http://127.0.0.1:8000/`**

**_Una vez inicializada la aplicación los <u>logs</u> quedaran registrados en la ruta `api/app/core/logs/`_**

## Endpoints

Para consultar los diferentes enpoints de la aplicación, así como sus payloads y respuestas esta la ruta **http://127.0.0.1:8000/docs**. En la cual se puede consultar dicha información.

### AUTH

<details> <summary><strong>Auth Endpoints</strong></summary>

-  POST /auth/register

   -  Tipo: POST

   -  Parámetros de ruta: ninguno

   -  Autenticación: ninguna

   -  Request schema: UserRegLogSchema

   -  Response schema: UserLogRespSchema

-  POST /auth/login

   -  Tipo: POST

   -  Parámetros de ruta: ninguno

   -  Autenticación: ninguna

   -  Request schema: UserRegLogSchema

   -  Response schema: UserLogRespSchema

</details>

### ANIME

<details> <summary><strong>Anime Endpoints</strong></summary>

-  POST /anime/

   -  Tipo: POST

   -  Parámetros: ninguno

   -  Autenticación: opcional

   -  Request schema: FilterSchema

   -  Response schema: AnimeSearchSchema

-  POST /anime/emision/

   -  Tipo: POST

   -  Parámetros: ninguno

   -  Autenticación: opcional

   -  Request schema: FilterSchema

   -  Response schema: AnimeSearchSchema

-  GET /anime/{key_anime}

   -  Tipo: GET

   -  Parámetros:

      -  key_anime: int

   -  Autenticación: opcional

   -  Request schema: ninguno

   -  Response schema: AnimeSchema

-  POST /anime/changeFavStatus

   -  Tipo: POST

   -  Parámetros: ninguno

   -  Autenticación: requerida (usuario)

   -  Request schema: AniFavPayloadSchema

   -  Response schema: AniFavRespSchema

</details>

### MANGA

<details> <summary><strong>Manga Endpoints</strong></summary>

-  POST /manga/

   -  Tipo: POST

   -  Parámetros: ninguno

   -  Autenticación: opcional

   -  Request schema: FilterSchema

   -  Response schema: MangaSearchSchema

-  POST /manga/publicando/

   -  Tipo: POST

   -  Parámetros: ninguno

   -  Autenticación: opcional

   -  Request schema: FilterSchema

   -  Response schema: MangaSearchSchema

-  GET /manga/{key_manga}

   -  Tipo: GET

   -  Parámetros:

      -  key_manga: int

   -  Autenticación: opcional

   -  Request schema: ninguno

   -  Response schema: MangaSchema

-  POST /manga/changeFavStatus

   -  Tipo: POST

   -  Parámetros: ninguno

   -  Autenticación: requerida (usuario)

   -  Request schema: MangaFavPayloadSchema

   -  Response schema: AniFavRespSchema

</details>

### USER

<details> <summary><strong>User Endpoints</strong></summary>

-  GET /user/me/

   -  Tipo: GET

   -  Parámetros: ninguno

   -  Autenticación: usuario

   -  Request schema: ninguno

   -  Response schema: UserLogRespSchema

-  GET /user/{username}

   -  Tipo: GET

   -  Parámetros:

      -  username: UsernameType (str)

   -  Autenticación: opcional

   -  Request schema: ninguno

   -  Response schema: UserLogRespSchema

-  GET /user/stats/{username}

   -  Tipo: GET

   -  Parámetros:

      -  username: UsernameType (str)
      
      - tipoStats: TypeStatisticEnum (int)

   -  Autenticación: opcional

   -  Request schema: ninguno

   -  Response schema: FavsCountSchema

-  POST /user/anime_list/{username}

   -  Tipo: POST

   -  Parámetros:

      -  username: UsernameType (str)

   -  Autenticación: opcional

   -  Request schema: FilterSchema

   -  Response schema: AnimeSearchSchema

-  POST /user/manga_list/{username}

   -  Tipo: POST

   -  Parámetros:

      -  username: UsernameType

   -  Autenticación: opcional

   -  Request schema: FilterSchema

   -  Response schema: MangaSearchSchema

-  POST /user/change_profpic/

   -  Tipo: POST

   -  Autenticación: usuario

   -  Request schema: PayloadProfPicSchema

   -  Response schema: PayloadProfPicSchema

-  POST /user/change_username/

   -  Tipo: POST

   -  Autenticación: usuario

   -  Request schema: PayloadUsernameSchema

   -  Response schema: PayloadUsernameSchema

-  POST /user/change_email/

   -  Tipo: POST

   -  Autenticación: usuario

   -  Request schema: PayloadEmailSchema

   -  Response schema: PayloadEmailSchema

-  POST /user/change_password/

   -  Tipo: POST

   -  Autenticación: usuario

   -  Request schema: PayloadPassSchema

   -  Response schema: ResponseNewPassSchema

</details>

### SEARCH

<details> <summary><strong>Search Endpoints</strong></summary>

-  POST /search/

   -  Tipo: POST

   -  Parámetros: ninguno

   -  Autenticación: opcional

   -  Request schema: FilterSchema

   -  Response schema: SearchAllSchema

</details>

### DASHBOARD (ADMIN)

<details> <summary><strong>Dashboard General</strong></summary>

-  GET /dashboard/stats/

   -  Tipo: GET

   -  Parámetros: 

      - tipoStats: TypeStatisticEnum (int)

   -  Autenticación: admin

   -  Request schema: ninguno

   -  Response schema: ConteoGeneralSchema

-  POST /dashboard/users_list/

   -  Tipo: POST

   -  Autenticación: admin

   -  Request schema: UserListFilterSchema

   -  Response schema: UserListSchema

-  POST /dashboard/cng_active_state/

   -  Tipo: POST

   -  Autenticación: admin

   -  Request schema: PayloadActiveStateSchema

   -  Response schema: PayloadActiveStateSchema

</details>

### DASHBOARD ANIME (ADMIN)

<details> <summary><strong>Dashboard Anime</strong></summary>

-  POST /dashboard/anime/create/

   -  Tipo: POST

   -  Autenticación: admin

   -  Request schema: AnimeCreateSchema

   -  Response schema: ResponseUpdCrtAnime

-  PUT /dashboard/anime/update/{anime_id}

   -  Tipo: PUT

   -  Parámetros:

      -  anime_id: ObjectIdStr (str)

   -  Autenticación: admin

   -  Request schema: AnimeUpdateSchema

   -  Response schema: ResponseUpdCrtAnime

-  DELETE /dashboard/anime/delete/{anime_id}

   -  Tipo: DELETE

   -  Parámetros:

      -  anime_id: ObjectIdStr

   -  Autenticación: admin

   -  Request schema: ninguno

   -  Response schema: ResponseUpdCrtAnime

-  POST /dashboard/anime/search_on_mal/

   -  Tipo: POST

   -  Autenticación: admin

   -  Request schema: PayloadSearchAnimeMAL

   -  Response schema: ResponseSearchAnimeMAL

-  POST /dashboard/anime/assign_id_mal/

   -  Tipo: POST

   -  Autenticación: admin

   -  Request schema: PayloadAnimeIDMAL

   -  Response schema: ResponseUpdCrtAnime

-  GET /dashboard/anime/update_from_mal/{anime_id}

   -  Tipo: GET

   -  Parámetros:

      -  anime_id: ObjectIdStr

   -  Autenticación: admin

   -  Request schema: ninguno

   -  Response schema: JSON personalizado

-  GET /dashboard/anime/update_all_to_mal/

   -  Tipo: GET

   -  Parámetros: ninguno

   -  Autenticación: admin

   -  Request schema: ninguno

   -  Response schema: JSON personalizado

-  POST /dashboard/anime/get_incomplete/{ready_to_mal}

-  Tipo: POST

   -  Parámetros:

      -  ready_to_mal: int

   -  Autenticación: admin

   -  Request schema: FilterSchema

   -  Response schema: SearchAnimeIncompleteSchema

-  POST /dashboard/anime/upload_file/

   -  Tipo: POST

   -  Autenticación: admin

   -  Request schema: archivo JSON

   -  Response schema: ResponseUpdAllMALSchema

-  POST /dashboard/anime/genres_list/

   -  Tipo: POST

   -  Autenticación: admin

   -  Request schema: FilterGSAESchema

   -  Response schema: SearchGenresSchema

-  POST /dashboard/anime/studios_list/

   -  Tipo: POST

   -  Autenticación: admin

   -  Request schema: FilterGSAESchema

   -  Response schema: SearchStudiosSchema

</details>

### DASHBOARD MANGA (ADMIN)

<details> <summary><strong>Dashboard Manga</strong></summary>

-  POST /dashboard/manga/create/

   -  Tipo: POST

   -  Autenticación: admin

   -  Request schema: MangaCreateSchema

   -  Response schema: ResponseUpdCrtManga

-  PUT /dashboard/manga/update/{manga_id}

   -  Tipo: PUT

   -  Parámetros:

      -  manga_id: ObjectIdStr

   -  Autenticación: admin

   -  Request schema: MangaUpdateSchema

   -  Response schema: ResponseUpdCrtManga

-  DELETE /dashboard/manga/delete/{manga_id}

   -  Tipo: DELETE

   -  Parámetros:

      -  manga_id: ObjectIdStr

   -  Autenticación: admin

   -  Request schema: ninguno

   -  Response schema: ResponseUpdCrtManga

-  POST /dashboard/manga/search_on_mal/

   -  Tipo: POST

   -  Autenticación: admin

   -  Request schema: PayloadSearchAnimeMAL

   -  Response schema: ResponseSearchMangaMAL

-  POST /dashboard/manga/assign_id_mal/

   -  Tipo: POST

   -  Autenticación: admin

   -  Request schema: PayloadAnimeIDMAL

   -  Response schema: ResponseUpdCrtManga

-  GET /dashboard/manga/update_from_mal/{manga_id}

   -  Tipo: GET

   -  Parámetros:

      -  manga_id: ObjectIdStr

   -  Autenticación: admin

   -  Request schema: ninguno

   -  Response schema: JSON personalizado

-  GET /dashboard/manga/update_all_to_mal/

   -  Tipo: GET

   -  Autenticación: admin

   -  Request schema: ninguno

   -  Response schema: JSON personalizado

-  POST /dashboard/manga/get_incomplete/{ready_to_mal}

   -  Tipo: POST

   -  Parámetros:

      -  ready_to_mal: int

   -  Autenticación: admin

   -  Request schema: FilterSchema

   -  Response schema: SearchMangaIncompleteSchema

-  POST /dashboard/manga/editorials_list/

   -  Tipo: POST

   -  Autenticación: admin

   -  Request schema: FilterGSAESchema

   -  Response schema: SearchEditorialsSchema

-  POST /dashboard/manga/authors_list/

   -  Tipo: POST

   -  Autenticación: admin

   -  Request schema: FilterGSAESchema

   -  Response schema: SearchAutoresSchema

</details>
