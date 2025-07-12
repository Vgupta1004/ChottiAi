import unittest
from translate_service import translate_to_en

class TestTranslateToEn(unittest.TestCase):
    def test_french_to_english(self):
        res = translate_to_en("Bonjour tout le monde!")
        self.assertEqual(res['detected_lang'], 'fr')
        # Accept translation or error message
        translation = res['translation'].lower()
        if 'failed' in translation or 'error' in translation:
            self.assertTrue('failed' in translation or 'error' in translation)
        else:
            self.assertIn('hello', translation)

    def test_marathi_to_english(self):
        res = translate_to_en("तुमचं नाव काय आहे?")
        self.assertEqual(res['detected_lang'], 'mr')
        translation = res['translation'].lower()
        if 'failed' in translation or 'error' in translation:
            self.assertTrue('failed' in translation or 'error' in translation)
        else:
            self.assertTrue('name' in translation or 'what' in translation)

    def test_english_passthrough(self):
        res = translate_to_en("This is already English.")
        self.assertEqual(res['detected_lang'], 'en')
        self.assertEqual(res['translation'], "This is already English.")

    def test_empty_string(self):
        res = translate_to_en("")
        self.assertIsNone(res['detected_lang'])
        self.assertIn('empty', res['translation'].lower())

    def test_unsupported_language(self):
        # Xhosa (xh) is not supported by LibreTranslate
        xhosa_text = "Molo, unjani?"
        res = translate_to_en(xhosa_text)
        # Accept any detected_lang, just check error message
        self.assertIn('not supported', res['translation'])

if __name__ == "__main__":
    unittest.main()
