import requests

BASE_URL = "https://www.datos.gov.co/resource"
VIEW_URL = "https://www.datos.gov.co/api/views"

# Headers para evitar bloqueos del servidor
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json",
    "Connection": "close"
}

def obtener_total_registros(dataset_id: str) -> int:
    """Obtiene el total de registros usando SELECT COUNT(*)"""
    url = f"{BASE_URL}/{dataset_id}.json?$select=count(*)"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        return int(response.json()[0]["count"])
    except Exception as e:
        print(f"Error obteniendo total de registros: {e}")
        return 0

def obtener_metadata(dataset_id: str):
    """Obtiene metadata del dataset usando /api/views/{id}"""
    url = f"{VIEW_URL}/{dataset_id}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        metadata = response.json()
        
        return {
            "titulo": metadata.get("name"),
            "descripcion": metadata.get("description"),
            "fuente": metadata.get("attribution"),
            "ultima_actualizacion": metadata.get("rowsUpdatedAt"),
            "columnas": [col["name"] for col in metadata.get("columns", [])]
        }
    except Exception as e:
        print(f"Error obteniendo metadata: {e}")
        return {"error": str(e)}

def obtener_dataset(dataset_id: str, limit: int = None, offset: int = 0):
    """
    Obtiene registros del dataset con paginación.
    
    Args:
        dataset_id: ID del dataset
        limit: cantidad de registros a obtener (máximo 50000)
        offset: número de registros a saltar (para paginación)
    """
    
    total = obtener_total_registros(dataset_id)
    
    if limit is None:
        limit = min(total, 5000)  # 5k por defecto
    else:
        limit = min(limit, 50000)  # Máximo 50k
    
    # Construir URL con $limit y $offset
    url = f"{BASE_URL}/{dataset_id}.json?$limit={limit}&$offset={offset}"
    
    try:
        print(f"Solicitando: {url}")
        response = requests.get(url, headers=HEADERS, timeout=30)
        response.raise_for_status()
        
        datos = response.json()
        
        return {
            "dataset_id": dataset_id,
            "total_registros": total,
            "registros_obtenidos": len(datos),
            "limit": limit,
            "offset": offset,
            "datos": datos
        }
    except requests.exceptions.RequestException as e:
        print(f"Error obteniendo dataset: {e}")
        return {
            "error": str(e),
            "dataset_id": dataset_id,
            "total_registros": total
        }
