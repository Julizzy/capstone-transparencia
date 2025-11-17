from fastapi import APIRouter
from services.dataset_service import obtener_metadata, obtener_dataset, obtener_total_registros

router = APIRouter()

@router.get("/{dataset_id}/metadata")
def get_dataset_metadata(dataset_id: str):
    """
    Devuelve metadatos de un dataset específico.
    Ejemplo: GET /api/datasets/h2yr-zfb2/metadata
    """
    try:
        return obtener_metadata(dataset_id)
    except Exception as e:
        return {"error": str(e), "dataset_id": dataset_id}

@router.get("/{dataset_id}")
def get_dataset(dataset_id: str, limit: int = 5000, offset: int = 0):
    """
    Devuelve registros de un dataset con paginación.
    Ejemplo: GET /api/datasets/h2yr-zfb2?limit=5000&offset=0
    """
    try:
        return obtener_dataset(dataset_id, limit=limit, offset=offset)
    except Exception as e:
        return {"error": str(e), "dataset_id": dataset_id}

@router.get("/{dataset_id}/total")
def get_dataset_total(dataset_id: str):
    """
    Devuelve el total de registros de un dataset.
    Ejemplo: GET /api/datasets/h2yr-zfb2/total
    """
    try:
        total = obtener_total_registros(dataset_id)
        return {"dataset_id": dataset_id, "total_registros": total}
    except Exception as e:
        return {"error": str(e), "dataset_id": dataset_id}
