from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

logger = logging.getLogger("uvicorn")

app = FastAPI(
    title="Capstone Transparencia API",
    description="API que conecta datasets de datos.gov.co",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ROUTERS = []

try:
    from routers.dataset_routes import router as dataset_router
    ROUTERS.append((dataset_router, "/api/datasets"))
    logger.info("✓ dataset_routes registrado")
except Exception as e:
    logger.error(f"✗ Error importando dataset_routes: {e}")

try:
    from routers.datasets_metadata_router import router as metadata_router
    ROUTERS.append((metadata_router, "/api/metadata"))
    logger.info("✓ datasets_metadata_router registrado")
except Exception as e:
    logger.error(f"✗ Error importando datasets_metadata_router: {e}")

try:
    from routers.chat_routes import router as chat_router
    ROUTERS.append((chat_router, "/api/chat"))
    logger.info("✓ chat_routes registrado")
except Exception as e:
    logger.error(f"✗ Error importando chat_routes: {e}")

try:
    from routers.analysis_routes import router as analysis_router
    ROUTERS.append((analysis_router, "/api/analysis"))
    logger.info("✓ analysis_routes registrado")
except Exception as e:
    logger.error(f"✗ Error importando analysis_routes: {e}")

for router_obj, prefix in ROUTERS:
    app.include_router(router_obj, prefix=prefix)
    logger.info(f"Registrado: {prefix}")

@app.get("/")
def root():
    return {"message": "API MVP funcionando correctamente 🚀"}

@app.get("/health")
def health():
    return {"status": "ok"}
