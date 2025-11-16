import requests
from .subsidiosVivienda_analitic import calcular_promedios_por_departamento

DATASET_ID = "h2yr-zfb2"
BASE_URL = "https://www.datos.gov.co/resource"

# Remove headers or define them
# If you don't have an API token, remove the headers completely

count_url = f"{BASE_URL}/{DATASET_ID}.json?$select=count(*)"
response = requests.get(count_url)  # <-- FIXED

print("COUNT STATUS:", response.status_code)
print("COUNT TEXT:", response.text)

try:
    total = int(response.json()[0]["count"])
except:
    total = 0
    print("Failed to fetch count.")

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
