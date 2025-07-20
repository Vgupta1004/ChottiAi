# translation_util.py

from llm_utils import call_llm

def translate_text(text: str, target_language: str) -> str:
    """
    Translates the given text to the target language using the LLM.
    """
    # We create a simple, direct prompt for the translation task.
    prompt = f"""
    Translate the following text into {target_language}.
    Provide only the translated text and nothing else. Do not add any extra phrases like "Here is the translation:".

    Text to translate:
    ---
    {text}
    ---
    """
    
    print(f"Sending text to LLM for translation to {target_language}...")
    
    try:
        translated_text = call_llm(prompt, temperature=0.2) # Lower temp for more direct translation
        return translated_text
    except Exception as e:
        print(f"❌ Error during translation: {e}")
        return text # Fallback to returning the original text on error