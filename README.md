# README.md

## Language Detection & English Translation Microservice

This microservice provides a single function to detect the language of a text and translate it to English using open-source libraries and APIs.

### Usage

```python
from translate_service import translate_to_en

result = translate_to_en("C'est la vie!")
print(result)
# Output: { 'detected_lang': 'fr', 'translation': "That's life!" }
```

### Features

- Detects language using `langdetect` (ISO 639-1 code)
- Translates to English using LibreTranslate API
- Handles empty input, unsupported languages, and API errors gracefully

### Requirements

- Python 3.7+
- See `requirements.txt`

### Testing

Run the tests with:

```
python -m unittest test_translate_service.py
```
