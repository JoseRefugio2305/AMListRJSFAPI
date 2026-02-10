from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timezone

from app.schemas.tasks import TaskStatus, TaskStatusResponse
from app.core.tasks.task_manager import task_manager
from app.core.security import require_admin
from app.core.logging import get_logger

logger = get_logger(__name__)

# Creamos el router con el prefijo y la tag de la documentacion
routerDashTasks = APIRouter(
    prefix="/dashboard/task", tags=["dashboard"], dependencies=[Depends(require_admin)]
)


@routerDashTasks.get("/{task_id}")
async def get_task_info(task_id: str):
    task = task_manager.get_task(task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tarea no encontrada",
        )
    # calculamos el tiempo transcurrido y el tiempo estimado restante
    elapsed = None
    estimated_remaining = None

    if task.started_at:
        elapsed = (datetime.now(timezone.utc) - task.started_at).total_seconds()

        if task.progress.actual > 0 and task.status == TaskStatus.RUNNING:
            seg_x_item = elapsed / task.progress.actual
            restantes_items = task.progress.total - task.progress.actual
            estimated_remaining = seg_x_item * restantes_items

    return TaskStatusResponse(
        task=task,
        is_finished=task.status
        in [TaskStatus.COMPLETADA, TaskStatus.FALLO, TaskStatus.CANCELADA],
        elapsed_seconds=elapsed,
        estimated_remaining_seconds=estimated_remaining,
    )


@routerDashTasks.post("/cancel/{task_id}")
async def cancel_task(task_id: str):
    is_canceled = task_manager.cancel_task(task_id)

    if not is_canceled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se pudo cancelar la tarea. Puede que ya esté finalizada o no exista.",
        )

    return {"message": "Tarea cancelada exitosamente.", "task_id": task_id}


@routerDashTasks.get("/list_all/")
async def get_all_tasks():
    tasks = task_manager.get_all_tasks()
    return {"tasks": list(tasks.values()), "total_tasks": len(tasks)}
