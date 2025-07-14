from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langdetect import detect, LangDetectException
from googletrans import Translator

app = FastAPI()
translator = Translator()

class TextInput(BaseModel):
    text: str

class TranslationOutput(BaseModel):
    detected_language: str
    translation: str

@app.post("/detect_translate", response_model=TranslationOutput)
def detect_and_translate(input: TextInput):
    try:
        detected_lang = detect(input.text)
    except LangDetectException:
        raise HTTPException(status_code=400, detail="Could not detect language.")
    try:
        # Translate to English for demonstration
        translated = translator.translate(input.text, dest='en')
        translation = translated.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")
    return TranslationOutput(detected_language=detected_lang, translation=translation)

@app.get("/")
def root():
    return {"message": "Language Detection and Translation API. Use /detect_translate endpoint."}
