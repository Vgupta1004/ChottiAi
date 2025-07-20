import { NextRequest, NextResponse } from 'next/server';

// This endpoint will receive translated messages in JSON format
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Log the received translated data
    console.log('📨 Received User-Selected Language Data:', JSON.stringify(data, null, 2));
    
    // Here you can process the translation data with user-selected language
    // For example: save to database, forward to another service, etc.
    
    // Expected JSON structure:
    // {
    //   language: string,         // User-selected language: "English (India)", "Hindi (India)", etc.
    //   translatedText: string    // e.g., "Hello, how are you?"
    // }
    
    return NextResponse.json({
      success: true,
      message: 'User-selected language data received successfully',
      received: data,
      processedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error processing translated message:', error);
    return NextResponse.json(
      { error: 'Failed to process translated message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'User-Selected Language Data Receiver API',
    description: 'This endpoint receives translation data with user-selected language and translated text',
    expectedFormat: {
      language: 'string (User-selected: "English (India)", "Hindi (India)", "Tamil (India)", etc.)',
      translatedText: 'string (e.g., "Hello, how are you?")'
    },
    availableLanguages: [
      'English (India)',
      'Hindi (India)',
      'Tamil (India)',
      'Bengali (India)',
      'Telugu (India)',
      'Marathi (India)',
      'Gujarati (India)',
      'Kannada (India)',
      'Malayalam (India)',
      'Punjabi (India)'
    ]
  });
}
