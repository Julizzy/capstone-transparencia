import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_DEFAULT_MODEL = os.getenv("GEMINI_DEFAULT_MODEL", "gemini-2.5-flash")
GEMINI_USE_VERTEXAI = os.getenv("GEMINI_USE_VERTEXAI", "false").lower() == "true"
GEMINI_PROJECT = os.getenv("GEMINI_PROJECT", "")
GEMINI_LOCATION = os.getenv("GEMINI_LOCATION", "")

DEBUG = os.getenv("DEBUG", "false").lower() == "true"
