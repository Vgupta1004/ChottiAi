"""
translate_service.py

A self-contained function to detect the language of a text and translate it to English.
Uses langdetect for language detection and LibreTranslate API for translation.
"""
import requests
from langdetect import detect, LangDetectException

LIBRETRANSLATE_URL = "https://translate.astian.org/translate"

SUPPORTED_LANGS = {
    # ISO 639-1 codes supported by LibreTranslate + major Indian languages
    'ar', 'az', 'zh', 'cs', 'da', 'nl', 'en', 'fi', 'fr', 'de', 'el', 'hi', 'hu',
    'id', 'ga', 'it', 'ja', 'ko', 'fa', 'pl', 'pt', 'ru', 'es', 'sv', 'tr', 'uk', 'uz', 'vi',
    # Indian regional languages (add if supported by LibreTranslate or your backend)
    'mr', # Marathi
    'bn', # Bengali
    'ta', # Tamil
    'te', # Telugu
    'kn', # Kannada
    'ml', # Malayalam
    'pa', # Punjabi
    'gu', # Gujarati
    'or', # Odia
}

def translate_to_en(text: str) -> dict:
    """
    Detects the language of the input text and translates it to English.

    Args:
        text (str): The input text to detect and translate.

    Returns:
        dict: { 'detected_lang': <ISO 639-1 code>, 'translation': <english_text> }
              or error message in 'translation' if failed.
    """
    if not text or not text.strip():
        return {'detected_lang': None, 'translation': 'Input text is empty.'}
    try:
        detected_lang = detect(text)
    except LangDetectException:
        return {'detected_lang': None, 'translation': 'Could not detect language.'}
    if detected_lang == 'en':
        return {'detected_lang': 'en', 'translation': text}
    if detected_lang not in SUPPORTED_LANGS:
        return {'detected_lang': detected_lang, 'translation': f'Language {detected_lang} not supported for translation.'}
    try:
        payload = {
            'q': text,
            'source': detected_lang,
            'target': 'en',
            'format': 'text',
            'alternatives': 1
        }
        headers = {"Content-Type": "application/json"}
        resp = requests.post(
            LIBRETRANSLATE_URL,
            json=payload,
            headers=headers,
            timeout=10
        )
        if resp.status_code == 200:
            data = resp.json()
            return {'detected_lang': detected_lang, 'translation': data.get('translatedText', '')}
        else:
            return {'detected_lang': detected_lang, 'translation': f'Translation API error: {resp.status_code}'}
    except Exception as e:
        return {'detected_lang': detected_lang, 'translation': f'Translation failed: {str(e)}'}

if __name__ == "__main__":
    # Example usage: Hindi and Tamil
    print('Hindi:', translate_to_en("आपका नाम क्या है?"))
    print('Tamil:', translate_to_en("உங்கள் பெயர் என்ன?"))
