from fastapi import APIRouter
from services.subsidiosVivienda_service import (
    obtener_metadata_subsidios,
    obtener_subsidios
)

router = APIRouter(prefix="/api/datasets", tags=["Datasets"])

@router.get("/metadata")
def listar_metadatos():
    """
    Devuelve los metadatos de todos los datasets disponibles + una muestra real.
    """
    metadata = obtener_metadata_subsidios()

    # Obtener 20 registros reales para que el frontend pueda buscar por municipio/programa
    muestra = obtener_subsidios(limit=20)["registros"]

    return {
        "subsidiosVivienda": metadata,
        "preview": muestra
    }
