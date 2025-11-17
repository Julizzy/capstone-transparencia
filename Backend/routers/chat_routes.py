from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.chat_session import obtener_sesion, limpiar_sesion

router = APIRouter()

class MensajeChat(BaseModel):
    """Modelo para recibir mensajes del usuario."""
    mensaje: str

class RespuestaChat(BaseModel):
    """Modelo para responder al usuario."""
    respuesta: str
    dataset_id: str

@router.post("/{dataset_id}")
def enviar_mensaje_chat(dataset_id: str, body: MensajeChat):
    """
    Envía un mensaje sobre un dataset específico.
    Ejemplo: POST /api/chat/h2yr-zfb2
    Body: {"mensaje": "¿Cuáles son las tendencias principales?"}
    """
    try:
        if not body.mensaje or not body.mensaje.strip():
            raise HTTPException(status_code=400, detail="El mensaje no puede estar vacío")
        
        sesion = obtener_sesion(dataset_id)
        respuesta = sesion.enviar_mensaje(body.mensaje)
        
        return RespuestaChat(respuesta=respuesta, dataset_id=dataset_id)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el chat: {str(e)}")

@router.get("/{dataset_id}/historial")
def obtener_historial_chat(dataset_id: str):
    """
    Obtiene el historial de conversación de un dataset.
    Ejemplo: GET /api/chat/h2yr-zfb2/historial
    """
    try:
        sesion = obtener_sesion(dataset_id)
        return {
            "dataset_id": dataset_id,
            "historial": sesion.obtener_historial()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo historial: {str(e)}")

@router.delete("/{dataset_id}/limpiar")
def limpiar_chat(dataset_id: str):
    """
    Limpia el historial de chat de un dataset.
    Ejemplo: DELETE /api/chat/h2yr-zfb2/limpiar
    """
    try:
        limpiar_sesion(dataset_id)
        return {
            "dataset_id": dataset_id,
            "mensaje": "Chat limpiado correctamente"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error limpiando chat: {str(e)}")
