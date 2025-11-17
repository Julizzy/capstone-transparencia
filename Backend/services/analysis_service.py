import json
import os
from pathlib import Path
from services.gemini_service import send_to_gemini
from services.dataset_service import obtener_dataset

DATA_DIR = Path(__file__).parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)

def get_analysis_filepath(dataset_id: str) -> Path:
    """Devuelve la ruta del archivo de análisis para un dataset."""
    return DATA_DIR / f"analysis_{dataset_id}.json"

def analisis_existe(dataset_id: str) -> bool:
    """Verifica si existe un análisis almacenado."""
    filepath = get_analysis_filepath(dataset_id)
    return filepath.exists()

def cargar_analisis(dataset_id: str) -> dict:
    """Carga un análisis existente."""
    filepath = get_analysis_filepath(dataset_id)
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        return {"error": f"No se pudo cargar el análisis: {e}"}

def guardar_analisis(dataset_id: str, analisis: dict) -> bool:
    """Guarda un análisis generado."""
    filepath = get_analysis_filepath(dataset_id)
    try:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(analisis, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Error guardando análisis: {e}")
        return False

def generar_analisis_gemini(dataset_id: str, limite_registros: int = 100) -> dict:
    """
    Genera un análisis del dataset usando Gemini.
    Obtiene una muestra de datos y envía a Gemini para análisis.
    """
    try:
        # Obtener datos del dataset (muestra limitada)
        datos = obtener_dataset(dataset_id, limit=limite_registros)
        
        # Preparar prompt para Gemini
        registros = datos.get("datos", [])
        
        prompt = f"""
Analiza el siguiente dataset de manera clara y concisa.

Dataset ID: {dataset_id}
Total de registros: {datos.get("total_registros", "desconocido")}
Registros analizados: {len(registros)}

Datos (primeros registros):
{json.dumps(registros[:10], ensure_ascii=False, indent=2)}

Por favor proporciona:
1. **Resumen ejecutivo**: descripción breve del dataset
2. **Tendencias principales**: patrones o tendencias observados
3. **Estadísticas clave**: números relevantes
4. **Insights**: hallazgos importantes
5. **Recomendaciones**: sugerencias de uso

Responde en formato JSON estructurado.
"""
        
        # Llamar a Gemini
        respuesta = send_to_gemini(prompt)
        
        # Procesar respuesta
        analisis = {
            "dataset_id": dataset_id,
            "generado_con": "Gemini",
            "respuesta": str(respuesta),
            "timestamp": __import__("datetime").datetime.now().isoformat()
        }
        
        return analisis
        
    except Exception as e:
        return {"error": f"Error generando análisis con Gemini: {e}"}

def obtener_o_generar_analisis(dataset_id: str) -> dict:
    """
    Obtiene un análisis existente o lo genera si no existe.
    """
    # Verificar si existe
    if analisis_existe(dataset_id):
        print(f"Análisis encontrado para {dataset_id}")
        return cargar_analisis(dataset_id)
    
    # Si no existe, generar
    print(f"Generando análisis para {dataset_id}...")
    analisis = generar_analisis_gemini(dataset_id)
    
    # Guardar
    if "error" not in analisis:
        guardado = guardar_analisis(dataset_id, analisis)
        if guardado:
            print(f"Análisis guardado para {dataset_id}")
    
    return analisis

def limpiar_analisis(dataset_id: str) -> bool:
    """Elimina el análisis almacenado de un dataset."""
    filepath = get_analysis_filepath(dataset_id)
    try:
        if filepath.exists():
            filepath.unlink()
            return True
    except Exception as e:
        print(f"Error eliminando análisis: {e}")
    return False