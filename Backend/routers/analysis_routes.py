from fastapi import APIRouter
from services.analysis_service import obtener_o_generar_analisis, limpiar_analisis, analisis_existe

router = APIRouter()

@router.get("/{dataset_id}")
def get_analysis(dataset_id: str):
    """
    Obtiene el análisis de un dataset.
    Si no existe, lo genera con Gemini y lo almacena.
    Ejemplo: GET /api/analysis/h2yr-zfb2
    """
    try:
        return obtener_o_generar_analisis(dataset_id)
    except Exception as e:
        return {"error": str(e), "dataset_id": dataset_id}

@router.get("/{dataset_id}/status")
def get_analysis_status(dataset_id: str):
    """
    Verifica si existe un análisis almacenado.
    Ejemplo: GET /api/analysis/h2yr-zfb2/status
    """
    existe = analisis_existe(dataset_id)
    return {
        "dataset_id": dataset_id,
        "analisis_existe": existe,
        "estado": "listo" if existe else "no generado"
    }

@router.delete("/{dataset_id}")
def delete_analysis(dataset_id: str):
    """
    Elimina el análisis almacenado de un dataset.
    Ejemplo: DELETE /api/analysis/h2yr-zfb2
    """
    eliminado = limpiar_analisis(dataset_id)
    return {
        "dataset_id": dataset_id,
        "eliminado": eliminado,
        "mensaje": "Análisis eliminado" if eliminado else "No se encontró análisis"
    }
