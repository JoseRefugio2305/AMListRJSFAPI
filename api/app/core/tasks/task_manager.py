from typing import Dict, Optional, List
from datetime import datetime, timezone, timedelta
import asyncio
from uuid import uuid4

from app.schemas.tasks import TaskResult, TaskStatus, TaskProgress, TaskError
from app.core.redis.client import redis_client
from app.core.logging import get_logger

logger = get_logger(__name__)


class TaskManager:

    def __init__(self):
        # Diccionarios para guardar info en memoria cuando se este en desarrollo, en produccion se guardara en redis
        self._memory_tasks: Dict[str, TaskResult] = {}  # Tareas
        self._memory_cancel_flags: Dict[str, bool] = {}  # Estados de cancelacion

        # Prefijos para almacenar en redis
        self.PREFIX_TASK = "task:"
        self.PREFIX_CANCEL = "cancel:"

        asyncio.create_task(self._cleanup_old_tasks())

    async def _set_redis(self, key: str, value: str, ttl: int = 86400):
        redis = redis_client.get_client()
        if redis:
            await redis.setex(
                key, ttl, value
            )  # Creamos la clave y agregamos su expiracion de 24 horas

    async def _get_redis(self, key: str) -> Optional[str]:
        redis = redis_client.get_client()
        if redis:
            return await redis.get(key)
        return None

    async def _delete_redis(self, key: str):
        redis = redis_client.get_client()
        if redis:
            await redis.delete(key)

    async def _scan_redis(self, pattern: str) -> List[str]:
        redis = redis_client.get_client()
        if redis:
            keys = []
            async for key in redis.scan_iter(match=pattern):
                keys.append(key)
            return keys
        return []

    async def create_task(self, task_name: str, total_items: int) -> str:
        task_id = str(uuid4())
        new_task = TaskResult(
            task_id=task_id,
            task_name=task_name,
            status=TaskStatus.PENDIENTE,
            progress=TaskProgress(total=total_items),
            can_cancel=True,
        )

        if redis_client.is_available:
            task_json = new_task.model_dump_json()  # Convertimos el modelo a JSON
            await self._set_redis(
                f"{self.PREFIX_TASK}{task_id}", task_json
            )  # Guardamos en Redis
            await self._set_redis(
                f"{self.PREFIX_CANCEL}{task_id}", "false"
            )  # Inicializamos el flag de cancelacion en Redis
        else:
            self._memory_tasks[task_id] = new_task
            self._memory_cancel_flags[task_id] = False
        logger.info(f"Tarea creada: {task_id} - {task_name}")
        return task_id

    async def update_task(self, task: TaskResult):
        if redis_client.is_available:
            task_json = task.model_dump_json()  # Convertimos el modelo a JSON
            await self._set_redis(
                f"{self.PREFIX_TASK}{task.task_id}", task_json
            )  # Actualizamos en Redis
        else:
            self._memory_tasks[task.task_id] = task

    async def start_task(self, task_id: str):
        task = await self.get_task(task_id)
        if task:
            task.status = TaskStatus.RUNNING
            task.started_at = datetime.now(timezone.utc)
            await self.update_task(task)
            logger.info(f"Tarea iniciada: {task_id}")
        else:
            logger.warning(f"Intento de iniciar tarea no encontrada: {task_id}")

    async def update_progress(
        self, task_id: str, actual: int, total: Optional[int] = None
    ):
        task = await self.get_task(task_id)
        if not task:
            return

        task.progress.actual = actual

        if total is not None:
            task.progress.total = total

        if task.progress.total > 0:
            task.progress.porcentaje = round((actual / task.progress.total) * 100, 2)

        await self.update_task(task)

    async def add_error(self, task_id: str, item_id: str, error_message: str):
        task = await self.get_task(task_id)

        if not task:
            logger.warning(f"Intento de agregar error a tarea no encontrada: {task_id}")
            return

        task.error_count += 1
        task.errors.append(
            TaskError(
                item_id=item_id,
                error_message=error_message,
                timestamp=datetime.now(timezone.utc),
            )
        )

        # Limitamos el numero de errores almacenados para evitar consumo excesivo de memoria
        if len(task.errors) > 100:
            task.errors = task.errors[-100:]

        await self.update_task(task)

    async def increment_success(self, task_id: str):
        task = await self.get_task(task_id)
        if task:
            task.success_count += 1
            await self.update_task(task)
        else:
            logger.warning(
                f"Intento de incrementar exitos de tarea no encontrada: {task_id}"
            )

    async def complete_task(self, task_id: str, resultd_data: Optional[Dict]):
        task = await self.get_task(task_id)
        if not task:
            logger.warning(f"Intento de completar tarea no encontrada: {task_id}")
            return

        task.status = TaskStatus.COMPLETADA
        task.completed_at = datetime.now(timezone.utc)
        task.can_cancel = False

        if resultd_data:
            task.result_data = resultd_data

        await self.update_task(task)

        logger.info(
            f"Tarea completada: {task_id} | Exitos: {task.success_count} | Errores: {task.error_count}"
        )

    async def fail_task(self, task_id: str, error_message: str):
        task = await self.get_task(task_id)
        if not task:
            logger.warning(
                f"Intento de marcar como fallida tarea no encontrada: {task_id}"
            )
            return

        task.status = TaskStatus.FALLO
        task.completed_at = datetime.now(timezone.utc)
        task.can_cancel = False

        task.errors.append(
            TaskError(
                item_id="GENERAL",
                error_message=error_message,
                timestamp=datetime.now(timezone.utc),
            )
        )
        await self.update_task(task)
        logger.error(f"Tarea fallida: {task_id} | Error: {error_message}")

    async def cancel_task(self, task_id: str):
        task = await self.get_task(task_id)
        if not task:
            logger.warning(f"Intento de cancelar tarea no encontrada: {task_id}")
            return

        if task.status not in [TaskStatus.PENDIENTE, TaskStatus.RUNNING]:
            logger.warning(
                f"Intento de cancelar tarea que no esta en ejecucion o espera: {task_id}"
            )
            return False  # Ya termino la tarea

        if redis_client.is_available:
            await self._set_redis(
                f"{self.PREFIX_CANCEL}{task_id}", "true"
            )  # Marcamos la tarea como cancelada en Redis
        else:
            self._memory_cancel_flags[task_id] = (
                True  # Cambiamos el flag de la tarea a cancelada en memoria
            )

        task.status = TaskStatus.CANCELADA
        task.completed_at = datetime.now(timezone.utc)
        task.can_cancel = False

        await self.update_task(task)
        logger.info(f"Tarea cancelada: {task_id}")
        return True

    async def is_cancelled(self, task_id: str) -> bool:
        if redis_client.is_available:
            flag = await self._get_redis(f"{self.PREFIX_CANCEL}{task_id}")
            return flag == "true"
        return self._memory_cancel_flags.get(task_id, False)

    async def get_task(self, task_id: str) -> Optional[TaskResult]:
        if redis_client.is_available:
            task_json = await self._get_redis(f"{self.PREFIX_TASK}{task_id}")
            if task_json:
                return TaskResult.model_validate_json(task_json)
            return None
        return self._memory_tasks.get(task_id)

    async def get_all_tasks(self) -> Dict[str, TaskResult]:
        if redis_client.is_available:
            keys = await self._scan_redis(f"{self.PREFIX_TASK}*")
            tasks = []
            for key in keys:
                task_json = await self._get_redis(key)
                if task_json:
                    tasks.append(TaskResult.model_validate_json(task_json))
            return tasks
        return self._memory_tasks

    async def _cleanup_old_tasks(self):
        while True:
            try:
                await asyncio.sleep(3600)  # Cada hora

                cutoff = datetime.now(timezone.utc) - timedelta(
                    hours=24
                )  # Eliminar tareas de mas de 24 horas

                if redis_client.is_available:
                    pass  # Redis limpia automaticamente las claves expiradas, por lo que no es necesario implementar una limpieza manual. Solo nos aseguramos de que las tareas tengan un TTL adecuado al crearlas o actualizarlas.
                else:
                    old_tasks = [
                        task_id
                        for task_id, task in self._memory_tasks.items()
                        if task.completed_at and task.completed_at < cutoff
                    ]  # Si tiene fecha de completado y esa fecha es anterior al cutoff, se considera vieja

                    for task_id in old_tasks:
                        del self._memory_tasks[task_id]
                        if task_id in self.cancel_flags:
                            del self._memory_cancel_flags[task_id]
                        logger.info(f"Tarea eliminada por limpieza: {task_id}")

                    if old_tasks:
                        logger.info(
                            f"Limpieza de tareas completada. Tareas eliminadas: {len(old_tasks)}"
                        )

            except Exception as e:
                logger.error(
                    f"Error durante la limpieza de tareas: {str(e)}", exc_info=True
                )


# Instancia global de la clase
task_manager = TaskManager()
