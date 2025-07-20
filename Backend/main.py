# main.py - FINAL IMPROVED VERSION

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

# Your existing imports
from inputs.llm_extract_info import extract_structured_info
from intent_model import classify_intent
from models.design_model import run_design_model
from models.tutorial_model import run_tutorial_model
from models.catalog_model import run_catalog_model
from models.general_model import run_general_model
from translation_util import translate_text

app = FastAPI(
    title="Artisan AI Assistant",
    description="An API to help artisans with design, tutorials, and catalogs, with translation support."
)

origins = [
    "https://chotti-ai.vercel.app",
    "https://chottiai-production.up.railway.app",
    "http://localhost:3000",  # The address of your Next.js app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)

class UserQuery(BaseModel):
    raw_input: str
    target_language: str | None = None

app.mount("/static", StaticFiles(directory="generated_images"), name="static")

@app.post("/process-query/")
def process_query(query: UserQuery):
    """
    Processes a user's query and optionally translates the response.
    """
    raw_input = query.raw_input
    print(f"Received query: {raw_input}")

    # Step 1: Get user intent
    intent = classify_intent(raw_input)
    print(f"Detected Intent: {intent}")

    # Step 2: Extract structured data (needed for design/catalog)
    structured = extract_structured_info(raw_input, query.target_language)
    
    text_response = ""
    image_urls = [] 

    # Step 3: Call the correct model with the correct information
    if intent in ["design", "catalog"]:
        # These intents NEED the structured data
        region = structured.get("region")
        product = structured.get("product")
        occasion = structured.get("occasion")
        
        if intent == "design":
            text_response, image_files = run_design_model(region, product, occasion)
            image_urls = image_files
        else: # catalog
            text_response = run_catalog_model(region, product, occasion)

    elif intent == "tutorial":
        # THIS IS THE FIX: Call the function with only the raw_input
        text_response, image_files = run_tutorial_model(raw_input)
        image_urls = image_files

    else: # General intent
        # General also uses the raw_input directly.
        text_response = run_general_model(raw_input)

    # Step 4: Translate the response if requested
    if query.target_language and text_response:
        print(f"✅ Translating response to {query.target_language}...")
        text_response = translate_text(text_response, query.target_language)

    # Step 5: Return the final response
    return {
        "intent": intent,
        "structured_info": structured,
        "text_response": text_response,
        "generated_images": image_urls,
        "translated_to": query.target_language if query.target_language else "Original Language (English)"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)