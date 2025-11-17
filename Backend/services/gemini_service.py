try:
    from google import genai
except Exception as e:
    genai = None
    print("google.genai no disponible:", e)

from config import settings

_client = None

def get_gemini_client():
    """
    Crea el cliente de genai de forma perezosa usando config.settings.
    """
    global _client
    if _client:
        return _client

    if genai is None:
        raise RuntimeError(
            "google.genai no está disponible. Instala la librería: pip install google-genai"
        )

    api_key = getattr(settings, "GEMINI_API_KEY", None)
    vertexai = getattr(settings, "GEMINI_USE_VERTEXAI", False)
    project = getattr(settings, "GEMINI_PROJECT", None)
    location = getattr(settings, "GEMINI_LOCATION", None)

    if api_key:
        _client = genai.Client(api_key=api_key)
        return _client

    if vertexai and project and location:
        _client = genai.Client(vertexai=True, project=project, location=location)
        return _client

    raise RuntimeError(
        "Falta configuración para Google GenAI. Define GEMINI_API_KEY en config.settings."
    )

DEFAULT_MODEL = getattr(settings, "GEMINI_DEFAULT_MODEL", "gemini-2.5-flash")

def send_to_gemini(prompt: str, **kwargs):
    """
    Envía prompt a Gemini usando la API correcta de google-genai.
    """
    client = get_gemini_client()
    try:
        model = kwargs.get("model", DEFAULT_MODEL)
        
        # Usar la API correcta: models.generate_content
        response = client.models.generate_content(
            model=model,
            contents=prompt
        )
        
        return response.text
        
    except Exception as e:
        raise RuntimeError(f"Error al llamar a Gemini: {e}")
