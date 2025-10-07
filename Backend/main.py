from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import subsidiosVivienda_router

app = FastAPI(
    title="API MVP de Datos Abiertos",
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

# Registrar los routers
app.include_router(subsidiosVivienda_router.router)

@app.get("/")
def root():
    return {"message": "API MVP funcionando correctamente 🚀"}
