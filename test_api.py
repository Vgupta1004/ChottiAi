import requests

def test_detect_translate(text):
    url = "http://127.0.0.1:8000/detect_translate"
    response = requests.post(url, json={"text": text})
    print(f"Input: {text}")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    # Test with some regional Indian languages
    test_cases = [
        "नमस्ते, आप कैसे हैं?",  # Hindi
        "வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?",  # Tamil
        "ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಾ?",  # Kannada
        "హలో, మీరు ఎలా ఉన్నారు?",  # Telugu
        "হ্যালো, আপনি কেমন আছেন?",  # Bengali
        "હેલો, તમે કેમ છો?",  # Gujarati
        "ਹੈਲੋ, ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",  # Punjabi
        "ഹലോ, നിങ്ങൾ എങ്ങിനെയാണ്?",  # Malayalam
        "Hello, how are you?"  # English
    ]
    for text in test_cases:
        test_detect_translate(text)
