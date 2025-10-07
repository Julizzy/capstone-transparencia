import requests
from .subsidiosVivienda_analitic import calcular_promedios_por_departamento

DATASET_ID = "h2yr-zfb2"
BASE_URL = "https://www.datos.gov.co/resource"

count_url = f"{BASE_URL}/{DATASET_ID}.json?$select=count(*)"
total = int(requests.get(count_url).json()[0]['count'])
print("Total de registros:", total)

def obtener_metadata_subsidios():
    meta_url = f"https://www.datos.gov.co/api/views/{DATASET_ID}"
    metadata = requests.get(meta_url).json()
    return {
        "titulo": metadata.get("name"),
        "descripcion": metadata.get("description"),
        "fuente": metadata.get("attribution"),
        "frecuencia_actualizacion": metadata.get("rowsUpdatedAt"),
        "columnas": [col["name"] for col in metadata.get("columns", [])]
    }

def obtener_subsidios(limit: int = 100000):
    data_url = f"{BASE_URL}/{DATASET_ID}.json?$limit={total}"

    data = requests.get(data_url).json()
    promedios = calcular_promedios_por_departamento(data)

    return { 
        "registros": data,
        "analisis": {
            "promedios_por_departamento": promedios
        }
        }
