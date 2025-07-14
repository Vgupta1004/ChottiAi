# Language Detection and Translation API

This FastAPI project provides an endpoint to detect the language of a given text and translate it to English. It is designed to work with regional Indian languages as well as others.

## Features

- Detects the language of input text using `langdetect`.
- Translates the text to English using `googletrans`.
- Accepts and returns data in JSON format.

## How to Run

1. **Activate the virtual environment** (if not already active):

   ```powershell
   .\.venv\Scripts\Activate
   ```

2. **Start the FastAPI server:**

   ```powershell
   uvicorn main:app --reload
   ```

   The API will be available at http://127.0.0.1:8000

## How to Test

1. **Run the FastAPI server** (in one terminal):

   ```powershell
   uvicorn main:app --reload
   ```

   The API will be available at http://127.0.0.1:8000

2. **Test using the provided script** (in a new terminal):

   ```powershell
   python test_api.py
   ```

   This will send sample texts in various regional Indian languages and print the detected language and translation.

3. **Test using the browser:**

   - Open http://127.0.0.1:8000/docs
   - Use the `/detect_translate` endpoint interactively.

4. **Test using curl or Postman:**
   - Send a POST request to `http://127.0.0.1:8000/detect_translate` with JSON body:
     ```json
     { "text": "नमस्ते, आप कैसे हैं?" }
     ```

## Example Request

POST to `/detect_translate` with JSON body:

```json
{
  "text": "नमस्ते, आप कैसे हैं?"
}
```

Example response:

```json
{
  "detected_language": "hi",
  "translation": "Hello, how are you?"
}
```

## Notes

- The translation is always to English (`en`).
- For best results, use clear sentences in regional Indian languages.
- If you encounter issues with translation, check your internet connection (googletrans uses Google Translate API).
