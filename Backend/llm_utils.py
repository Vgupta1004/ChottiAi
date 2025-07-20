 
# import os
# import requests
# from dotenv import load_dotenv

# load_dotenv()

# def call_claude(prompt):
#     headers = {
#         "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
#         "Content-Type": "application/json"
#     }
#     body = {
#         "model": "anthropic/claude-3-sonnet-20240229",
#         "messages": [{"role": "user", "content": prompt}],
#         "temperature": 0.7,
#         "maxcredits": 500
#     }
#     r = requests.post("https://openrouter.ai/api/v1/chat/completions", json=body, headers=headers)
#     try:
#         return r.json()["choices"][0]["message"]["content"]
#     except Exception:
#         print("[Claude Error]", r.text)
#         return "Error"

# import os
# import requests
# from dotenv import load_dotenv

# load_dotenv()

# API_URL = "https://openrouter.ai/api/v1/chat/completions"
# # MODEL_NAME = "deepseek/deepseek-chat-v3-0324:free"
# MODEL_NAME = "google/gemma-3n-e2b-it:free"

# def call_llm(prompt, temperature=0.7, max_tokens=512):
#     headers = {
#         "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
#         "Content-Type": "application/json"
#     }
#     payload = {
#         "model": MODEL_NAME,
#         "messages": [
#             # {"role": "system", "content": "You are a helpful assistant knowledgeable about traditional Indian handicrafts."},
#             {"role": "user", "content": prompt}
#         ],
#         "temperature": temperature,
#         "max_tokens": max_tokens
#     }
#     r = requests.post(API_URL, headers=headers, json=payload)
#     resp = r.json()
#     try:
#         return resp["choices"][0]["message"]["content"]
#     except Exception:
#         print("[LLM Error]", resp)
#         return "Error"

# llm_utils.py - Hugging Face Pro Version

import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

# --- Configuration ---
load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")

# With a Pro account, you can use powerful models. Mistral is an excellent choice.
# Other great options: 'meta-llama/Meta-Llama-3-8B-Instruct'
MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2"

if not HF_TOKEN:
    raise ValueError("Hugging Face token not found. Please add HF_TOKEN to your .env file.")

# Initialize the client for the Inference API
try:
    client = InferenceClient(model=MODEL_ID, token=HF_TOKEN)
except Exception as e:
    print(f"❌ Failed to initialize Hugging Face InferenceClient: {e}")
    client = None

def call_llm(prompt: str, temperature=0.7, max_tokens=1024) -> str:
    """
    Calls the Hugging Face Inference API using your Pro account.
    """
    if not client:
        return "Error: InferenceClient was not initialized."

    # The chat_completion method works like OpenAI's API and expects a list of messages.
    messages = [{"role": "user", "content": prompt}]
    
    try:
        response = client.chat_completion(
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature if temperature > 0.01 else 0.01, # Temp must be slightly > 0
            stream=False,  # We want the full response at once
        )
        
        # Extract the text content from the response object
        result = response.choices[0].message.content
        return result.strip()

    except Exception as e:
        print(f"❌ [Hugging Face LLM Error] {e}")
        return "Error"
    
def format_text_as_markdown(text_to_format: str) -> str:
    """
    Uses the LLM to reformat a block of text into clean Markdown.
    """
    prompt = f"""
    You are a text formatting expert. Your task is to take the following block of text and reformat it into clean, readable Markdown.

    Use the following rules:
    - Use Level 3 headings (###) for each item's title.
    - Use bullet points (*) for the details under each heading.
    - Use bold text (**) to highlight key terms like colors, techniques, or symbolic words.
    - Ensure there is proper spacing between sections.

    Original Text:
    ---
    {text_to_format}
    ---

    Formatted Markdown:
    """
    
    # Use a lower temperature for formatting to be more consistent
    formatted_text = call_llm(prompt, temperature=0.2)
    return formatted_text