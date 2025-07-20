import { NextRequest, NextResponse } from 'next/server';
import { translate } from '@vitalets/google-translate-api';
import { franc } from 'franc';

// ISO 639-1 language codes mapping (updated for Indian context)
const languageNames: { [key: string]: string } = {
  'en': 'English (India)',
  'hi': 'Hindi (India)',
  'ta': 'Tamil (India)',
  'bn': 'Bengali (India)',
  'te': 'Telugu (India)',
  'mr': 'Marathi (India)',
  'gu': 'Gujarati (India)',
  'kn': 'Kannada (India)',
  'ml': 'Malayalam (India)',
  'pa': 'Punjabi (India)',
  'or': 'Odia (India)',
  'as': 'Assamese (India)',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
  'ar': 'Arabic',
  'ur': 'Urdu',
  'ne': 'Nepali',
  'si': 'Sinhala',
  'my': 'Myanmar',
  'th': 'Thai',
  'vi': 'Vietnamese',
  'id': 'Indonesian',
  'ms': 'Malay',
  'tl': 'Filipino',
  'sw': 'Swahili',
  'yo': 'Yoruba',
  'ig': 'Igbo',
  'ha': 'Hausa',
  'zu': 'Zulu',
  'af': 'Afrikaans',
  'sq': 'Albanian',
  'am': 'Amharic',
  'hy': 'Armenian',
  'az': 'Azerbaijani',
  'eu': 'Basque',
  'be': 'Belarusian',
  'bs': 'Bosnian',
  'bg': 'Bulgarian',
  'ca': 'Catalan',
  'hr': 'Croatian',
  'cs': 'Czech',
  'da': 'Danish',
  'nl': 'Dutch',
  'eo': 'Esperanto',
  'et': 'Estonian',
  'fi': 'Finnish',
  'gl': 'Galician',
  'ka': 'Georgian',
  'el': 'Greek',
  'he': 'Hebrew',
  'hu': 'Hungarian',
  'is': 'Icelandic',
  'ga': 'Irish',
  'lv': 'Latvian',
  'lt': 'Lithuanian',
  'mk': 'Macedonian',
  'mt': 'Maltese',
  'no': 'Norwegian',
  'fa': 'Persian',
  'pl': 'Polish',
  'ro': 'Romanian',
  'sr': 'Serbian',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'sv': 'Swedish',
  'tr': 'Turkish',
  'uk': 'Ukrainian',
  'cy': 'Welsh'
};

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    // Detect language using franc
    const detectedLangCode = franc(text);
    const detectedLanguage = languageNames[detectedLangCode] || 'Unknown';

    // If already in English, return the original text
    if (detectedLangCode === 'en' || detectedLangCode === 'und') {
      return NextResponse.json({
        originalText: text,
        translatedText: text,
        detectedLanguage: detectedLangCode === 'en' ? 'English (India)' : 'Unknown',
        detectedLanguageCode: detectedLangCode === 'en' ? 'en' : 'unknown',
        isAlreadyEnglish: true
      });
    }

    try {
      // Translate to English using Google Translate
      const result = await translate(text, { to: 'en' });
      
      return NextResponse.json({
        originalText: text,
        translatedText: result.text,
        detectedLanguage: detectedLanguage,
        detectedLanguageCode: detectedLangCode,
        isAlreadyEnglish: false,
        confidence: 1 // franc doesn't provide confidence, so we set it to 1
      });
    } catch (translateError) {
      console.error('Translation error:', translateError);
      return NextResponse.json({
        originalText: text,
        translatedText: text,
        detectedLanguage: detectedLanguage,
        detectedLanguageCode: detectedLangCode,
        isAlreadyEnglish: false,
        error: 'Translation failed, returning original text'
      });
    }

  } catch (error) {
    console.error('Language detection/translation error:', error);
    return NextResponse.json(
      { error: 'Failed to process text' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Language Detection and Translation API',
    usage: 'POST with { "text": "your text here" }',
    features: [
      'Automatic language detection using franc',
      'Translation to English using Google Translate',
      'Support for 60+ languages',
      'Region/dialect awareness'
    ]
  });
}