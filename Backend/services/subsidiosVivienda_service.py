import requests

DATASET_ID = "h2yr-zfb2"
BASE_URL = "https://www.datos.gov.co/resource"

def obtener_subsidios(limit: int = 50):
    data_url = f"{BASE_URL}/{DATASET_ID}.json?$limit={limit}"
    meta_url = f"https://www.datos.gov.co/api/views/{DATASET_ID}"

    data = requests.get(data_url).json()
    metadata = requests.get(meta_url).json()

    meta_info = {
        "titulo": metadata.get("name"),
        "descripcion": metadata.get("description"),
        "publicado_por": metadata.get("metadata", {}).get("custom_fields", {}).get("Responsable"),
        "ultima_actualizacion": metadata.get("publicationDate"),
        "columnas": [col["name"] for col in metadata.get("columns", [])],
    }

    return {"metadata": meta_info, "registros": data}
