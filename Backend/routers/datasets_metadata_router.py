from fastapi import APIRouter
from services.dataset_service import obtener_metadata

router = APIRouter()

DATASETS_DISPONIBLES = {
    "h2yr-zfb2": "Subsidios De Vivienda Asignados"
}

@router.get("/metadata")
def listar_todos_metadatos():
    """
    Devuelve metadatos de TODOS los datasets disponibles.
    Ejemplo: GET /api/metadata/metadata
    """
    resultado = {}
    
    for dataset_id, nombre in DATASETS_DISPONIBLES.items():
        try:
            metadata = obtener_metadata(dataset_id)
            resultado[dataset_id] = metadata
        except Exception as e:
            resultado[dataset_id] = {"error": str(e)}
    
    return resultado

@router.get("/{dataset_id}")
def obtener_metadata_dataset(dataset_id: str):
    """
    Devuelve metadatos de un dataset específico.
    Ejemplo: GET /api/metadata/h2yr-zfb2
    """
    try:
        return obtener_metadata(dataset_id)
    except Exception as e:
        return {"error": str(e), "dataset_id": dataset_id}
