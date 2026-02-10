from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum


class TaskStatus(str, Enum):
    PENDIENTE = "pendiente"
    RUNNING = "running"
    COMPLETADA = "completada"
    FALLO = "fallo"
    CANCELADA = "cancelada"


class TaskError(BaseModel):
    item_id: str  # id del anime/manga que tuvo error
    error_message: str
    timestamp: datetime


class TaskProgress(BaseModel):
    actual: int = 0  # items procesados
    total: int = 0  # total de items
    porcentaje: float = 0.0


class TaskResult(BaseModel):
    task_id: str
    status: TaskStatus
    task_name: str  # Sera el nombre de la tarea, como update_all_animes_from_mal
    progress: TaskProgress

    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    success_count: int = 0
    error_count: int = 0
    errors: List[TaskError] = Field(default_factory=list)

    result_data: Optional[Dict[str, Any]] = None  # resultados de la tarea

    can_cancel: bool = True


class TaskStatusResponse(BaseModel):
    task: TaskResult
    is_finished: bool
    elapsed_seconds: Optional[float] = None
    estimated_remaining_seconds: Optional[float] = None
