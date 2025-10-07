import pandas as pd

def calcular_promedios_por_departamento(registros):
    df = pd.DataFrame(registros)

    df = df.rename(columns={
        "departamento": "departamento",
        "valor_asignado": "valor_asignado",
        "hogares": "hogares"
    })

    if "departamento" not in df.columns or "valor_asignado" not in df.columns:
        return {"error": f"Columnas disponibles: {list(df.columns)}"}

    df["valor_asignado"] = pd.to_numeric(df["valor_asignado"], errors="coerce")

    promedios = (
        df.groupby("departamento")["valor_asignado"]
        .mean()
        .reset_index()
        .rename(columns={"valor_asignado": "promedio_subsidio"})
    )

    return promedios.to_dict(orient="records")
