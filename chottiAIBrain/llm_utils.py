 
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

import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL_NAME = "deepseek/deepseek-chat-v3-0324:free"

def call_llm(prompt, temperature=0.7, max_tokens=512):
    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": "You are a helpful assistant knowledgeable about traditional Indian handicrafts."},
            {"role": "user", "content": prompt}
        ],
        "temperature": temperature,
        "max_tokens": max_tokens
    }
    r = requests.post(API_URL, headers=headers, json=payload)
    resp = r.json()
    try:
        return resp["choices"][0]["message"]["content"]
    except Exception:
        print("[LLM Error]", resp)
        return "Error"
