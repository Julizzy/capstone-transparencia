import requests

DATASET_URL = "https://www.datos.gov.co/resource/h2yr-zfb2.json"

def obtener_subsidios(limit: int = 500):
    """
    Consume el dataset de subsidios de vivienda desde datos.gov.co
    """
    params = {"$limit": limit}
    response = requests.get(DATASET_URL, params=params)

    if response.status_code != 200:
        return {"error": f"No se pudo obtener la información (HTTP {response.status_code})"}

    return response.json()
