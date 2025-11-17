import json
from typing import List, Dict
from services.dataset_service import obtener_dataset, obtener_metadata
from services.analysis_service import obtener_o_generar_analisis
from services.gemini_service import send_to_gemini

class ChatSession:
    """Gestiona una sesión de chat sobre un dataset específico."""
    
    def __init__(self, dataset_id: str):
        self.dataset_id = dataset_id
        self.historial = []
        self.contexto = None
        self._cargar_contexto()
    
    def _cargar_contexto(self):
        """Carga metadatos, análisis y muestra de datos del dataset."""
        try:
            metadata = obtener_metadata(self.dataset_id)
            analisis = obtener_o_generar_analisis(self.dataset_id)
            datos_muestra = obtener_dataset(self.dataset_id, limit=100)
            
            self.contexto = {
                "metadata": metadata,
                "analisis": analisis,
                "datos_muestra": datos_muestra.get("datos", []),
                "total_registros": datos_muestra.get("total_registros", 0)
            }
        except Exception as e:
            print(f"Error cargando contexto: {e}")
            self.contexto = {"error": str(e)}
    
    def agregar_mensaje(self, rol: str, contenido: str):
        """Agrega un mensaje al historial."""
        self.historial.append({
            "rol": rol,
            "contenido": contenido
        })
    
    def construir_prompt_contexto(self) -> str:
        """Construye un prompt con el contexto del dataset."""
        if not self.contexto or "error" in self.contexto:
            return ""
        
        metadata = self.contexto.get("metadata", {})
        analisis = self.contexto.get("analisis", {})
        datos_muestra = self.contexto.get("datos_muestra", [])
        total = self.contexto.get("total_registros", 0)
        
        prompt = f"""
CONTEXTO DEL DATASET:
=====================
Dataset ID: {self.dataset_id}
Título: {metadata.get("titulo", "N/A")}
Descripción: {metadata.get("descripcion", "N/A")}
Fuente: {metadata.get("fuente", "N/A")}
Total de registros: {total}
Columnas: {", ".join(metadata.get("columnas", []))}

ANÁLISIS PREVIO:
================
{json.dumps(analisis, ensure_ascii=False, indent=2)}

MUESTRA DE DATOS (primeros 5 registros):
========================================
{json.dumps(datos_muestra[:5], ensure_ascii=False, indent=2)}

---

Basándote en este contexto, responde las preguntas del usuario de forma clara y precisa.
Si no tienes información para responder, indícalo explícitamente.
"""
        return prompt
    
    def enviar_mensaje(self, mensaje_usuario: str) -> str:
        """Envía un mensaje y obtiene respuesta de Gemini."""
        try:
            # Agregar mensaje del usuario al historial
            self.agregar_mensaje("usuario", mensaje_usuario)
            
            # Construir prompt con contexto
            contexto = self.construir_prompt_contexto()
            
            # Construir historial para Gemini
            historial_texto = "\n".join([
                f"{msg['rol'].upper()}: {msg['contenido']}"
                for msg in self.historial
            ])
            
            prompt_completo = f"{contexto}\n\nCONVERSACIÓN:\n{historial_texto}"
            
            # Llamar a Gemini
            respuesta = send_to_gemini(prompt_completo)
            
            # Agregar respuesta al historial
            self.agregar_mensaje("asistente", respuesta)
            
            return respuesta
            
        except Exception as e:
            error_msg = f"Error al procesar mensaje: {e}"
            print(error_msg)
            return error_msg
    
    def obtener_historial(self) -> List[Dict]:
        """Devuelve el historial de la conversación."""
        return self.historial
    
    def limpiar_historial(self):
        """Limpia el historial de la sesión."""
        self.historial = []

# Almacenar sesiones activas (en producción usar Redis o DB)
_sesiones = {}

def obtener_sesion(dataset_id: str) -> ChatSession:
    """Obtiene o crea una sesión de chat para un dataset."""
    if dataset_id not in _sesiones:
        _sesiones[dataset_id] = ChatSession(dataset_id)
    return _sesiones[dataset_id]

def limpiar_sesion(dataset_id: str):
    """Limpia una sesión de chat."""
    if dataset_id in _sesiones:
        del _sesiones[dataset_id]