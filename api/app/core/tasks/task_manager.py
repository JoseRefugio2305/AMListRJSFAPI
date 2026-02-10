from typing import Dict, Optional
from datetime import datetime, timezone, timedelta
import asyncio
from uuid import uuid4

from app.schemas.tasks import TaskResult, TaskStatus, TaskProgress, TaskError
from app.core.logging import get_logger

logger = get_logger(__name__)


class TaskManager:

    def __init__(self):
        self._tasks: Dict[str, TaskResult] = {}  # Tareas
        self._cancel_flags: Dict[str, bool] = {}  # Estados de cancelacion

        asyncio.create_task(self._cleanup_old_tasks())

    def create_task(self, task_name: str, total_items: int) -> str:
        task_id = str(uuid4())
        self._tasks[task_id] = TaskResult(
            task_id=task_id,
            task_name=task_name,
            status=TaskStatus.PENDIENTE,
            progress=TaskProgress(total=total_items),
            can_cancel=True,
        )

        self._cancel_flags[task_id] = False
        logger.info(f"Tarea creada: {task_id} - {task_name}")
        return task_id

    def start_task(self, task_id: str):
        if task_id in self._tasks:
            self._tasks[task_id].status = TaskStatus.RUNNING
            self._tasks[task_id].started_at = datetime.now(timezone.utc)
            logger.info(f"Tarea iniciada: {task_id}")
        else:
            logger.warning(f"Intento de iniciar tarea no encontrada: {task_id}")

    def update_progress(self, task_id: str, actual: int, total: Optional[int] = None):
        if task_id not in self._tasks:
            logger.warning(
                f"Intento de actualizar progreso de tarea inexistente: {task_id}"
            )
            return
        task = self._tasks[task_id]
        task.progress.actual = actual

        if total is not None:
            task.progress.total = total

        if task.progress.total > 0:
            task.progress.porcentaje = (actual / task.progress.total) * 100

    def add_error(self, task_id: str, item_id: str, error_message: str):
        if task_id not in self._tasks:
            logger.warning(f"Intento de agregar error a tarea inexistente: {task_id}")
            return

        task = self._tasks[task_id]
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

    def increment_success(self, task_id: str):
        if task_id in self._tasks:
            self._tasks[task_id].success_count += 1

    def complete_task(self, task_id: str, resultd_data: Optional[Dict]):
        if task_id not in self._tasks:
            logger.warning(f"Intento de completar tarea inexistente: {task_id}")
            return

        task = self._tasks[task_id]
        task.status = TaskStatus.COMPLETADA
        task.completed_at = datetime.now(timezone.utc)
        task.can_cancel = False

        if resultd_data:
            task.result_data = resultd_data

        logger.info(
            f"Tarea completada: {task_id} | Exitos: {task.success_count} | Errores: {task.error_count}"
        )

    def fail_task(self, task_id: str, error_message: str):
        if task_id not in self._tasks:
            logger.warning(
                f"Intento de marcar como fallida tarea inexistente: {task_id}"
            )
            return

        task = self._tasks[task_id]
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

        logger.error(f"Tarea fallida: {task_id} | Error: {error_message}")

    def cancel_task(self, task_id: str):
        if task_id not in self._tasks:
            logger.warning(f"Intento de cancelar tarea inexistente: {task_id}")
            return

        task = self._tasks[task_id]

        if task.status not in [TaskStatus.PENDIENTE, TaskStatus.RUNNING]:
            logger.warning(
                f"Intento de cancelar tarea que no esta en ejecucion o espera: {task_id}"
            )
            return False  # Ya termino la tarea

        self._cancel_flags[task_id] = True  # Cambiamos el flag de la tarea a cancelada
        task.status = TaskStatus.CANCELADA
        task.completed_at = datetime.now(timezone.utc)
        task.can_cancel = False

        logger.info(f"Tarea cancelada: {task_id}")
        return True

    def is_cancelled(self, task_id: str) -> bool:
        return self._cancel_flags.get(task_id, False)

    def get_task(self, task_id: str) -> Optional[TaskResult]:
        return self._tasks.get(task_id)

    def get_all_tasks(self) -> Dict[str,TaskResult]:
        return self._tasks

    async def _cleanup_old_tasks(self):
        while True:
            try:
                await asyncio.sleep(3600)  # Cada hora

                cutoff = datetime.now(timezone.utc) - timedelta(
                    hours=24
                )  # Eliminar tareas de mas de 24 horas

                old_tasks = [
                    task_id
                    for task_id, task in self._tasks.items()
                    if task.completed_at and task.completed_at < cutoff
                ]  # Si tiene fecha de completado y esa fecha es anterior al cutoff, se considera vieja

                for task_id in old_tasks:
                    del self._tasks[task_id]
                    if task_id in self.cancel_flags:
                        del self._cancel_flags[task_id]
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
