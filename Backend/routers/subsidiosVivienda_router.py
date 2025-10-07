from fastapi import APIRouter, Query
from services.subsidiosVivienda_service import obtener_subsidios

router = APIRouter(prefix="/api/subsidios", tags=["Subsidios"])

@router.get("/")
def listar_subsidios(limit: int = Query(100000, description="Número máximo de registros")):
    """
    Obtiene una lista de subsidios de vivienda desde datos.gov.co
    """
    data = obtener_subsidios(limit)
    return data
