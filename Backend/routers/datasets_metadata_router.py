from fastapi import APIRouter
from services.subsidiosVivienda_service import obtener_metadata_subsidios

router = APIRouter(prefix="/api/datasets", tags=["Datasets"])

@router.get("/metadata")
def listar_metadatos():
    """
    Devuelve los metadatos de todos los datasets disponibles.
    """
    
    return {
        "subsidiosVivienda": obtener_metadata_subsidios()
    }