# Backend
pip install uvicorn requests fastapi dotenv google-genai python-dotenv

uvicorn main:app --reload

### URL

// Base URL de la API
const API_BASE_URL = "http://127.0.0.1:8000/api";

// ========== DATASETS ==========
// Obtener datos de un dataset específico
GET /api/datasets/{dataset_id}
GET /api/datasets/h2yr-zfb2?limit=5000&offset=0

// Obtener metadatos de un dataset
GET /api/datasets/{dataset_id}/metadata
GET /api/datasets/h2yr-zfb2/metadata

// Obtener total de registros de un dataset
GET /api/datasets/{dataset_id}/total
GET /api/datasets/h2yr-zfb2/total

// ========== METADATOS ==========
// Obtener metadatos de todos los datasets disponibles
GET /api/metadata/metadata

// Obtener metadatos de un dataset específico
GET /api/metadata/{dataset_id}
GET /api/metadata/h2yr-zfb2

// ========== ANÁLISIS ==========
// Obtener o generar análisis de un dataset
GET /api/analysis/{dataset_id}
GET /api/analysis/h2yr-zfb2

// Verificar si existe análisis de un dataset
GET /api/analysis/{dataset_id}/status
GET /api/analysis/h2yr-zfb2/status

// Eliminar análisis almacenado de un dataset
DELETE /api/analysis/{dataset_id}
DELETE /api/analysis/h2yr-zfb2

// ========== CHAT ==========
// Enviar mensaje sobre un dataset
POST /api/chat/{dataset_id}
POST /api/chat/h2yr-zfb2
Body: { "mensaje": "¿Cuáles son las principales tendencias?" }

// Obtener historial de conversación
GET /api/chat/{dataset_id}/historial
GET /api/chat/h2yr-zfb2/historial

// Limpiar historial de chat
DELETE /api/chat/{dataset_id}/limpiar
DELETE /api/chat/h2yr-zfb2/limpiar

// ========== SALUD ==========
// Verificar que la API está funcionando
GET /api/health
GET /

// ========== DOCUMENTACIÓN ==========
// Interfaz interactiva (Swagger UI)
GET http://127.0.0.1:8000/docs

// Documentación en OpenAPI JSON
GET http://127.0.0.1:8000/openapi.json