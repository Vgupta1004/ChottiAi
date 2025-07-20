# # inputs/llm_extract_info.py

# import json
# from llm_utils import call_llm

# def extract_structured_info(raw_input):
#     prompt = f"""
# Given the user request: "{raw_input}", extract the following structured information.

# 1. Region (state or cultural region in India)
# 2. Product type (e.g., saree, stole, bedsheet, etc.)
# 3. Occasion or use-case (e.g., wedding, Diwali, Christmas, gifting, daily use)

# Respond ONLY in valid JSON format like this:

# {{
#   "raw_input": "<copy input here>",
#   "region": "<region>",
#   "product": "<product>",
#   "occasion": "<occasion>"
# }}
# """
#     response = call_llm(prompt)

#     try:
#         parsed = json.loads(response)
#         with open("inputs/user_input.json", "w") as f:
#             json.dump(parsed, f, indent=2)
#         return parsed
#     except Exception as e:
#         print("❌ Could not parse structured output.\nRaw response:\n", response)
#         return None

# import json
# from llm_utils import call_llm

# def extract_structured_info(raw_input):
#     prompt = f"""Extract the region (village, town, or city with state), product, and occasion from the input.
# Return it as a JSON dictionary with keys: "region", "product", "occasion".
# For region, provide full detail (e.g., "Udaipur, Rajasthan" or "Kutch, Gujarat").

# Input: "{raw_input}" """

#     response = call_llm(prompt)

#     # 🧼 Clean markdown code block formatting if present
#     if response.startswith("```json"):
#         response = response.strip("```json").strip("```").strip()
#     elif response.startswith("```"):
#         response = response.strip("```").strip()

#     try:
#         data = json.loads(response)
#         return data
#     except json.JSONDecodeError:
#         print("❌ Could not parse structured output.")
#         print("Raw response:\n", response)
#         return None


# inputs/llm_extract_info.py

import json
from llm_utils import call_llm

def extract_structured_info(raw_input: str, target_language: str | None = None):
    """
    Extracts structured data, letting the LLM handle smart defaults.
    User-provided details always take precedence.
    """
    
    # Create a dynamic instruction for the LLM based on the target language.
    # This tells the LLM how to choose a default region.
    region_instruction = (
        f"If and only if the user's request does NOT mention a specific region, "
        f"your default region should be a plausible one for a '{target_language}' language speaker in India. "
        f"If the language is not a regional Indian language, default to 'India'."
    ) if target_language else "If and only if the user's request does NOT mention a specific region, default to 'India'."

    prompt = f"""
    You are an expert at extracting structured information from user requests.
    Your task is to populate a JSON object with three keys: "region", "product", and "occasion".

    **CRITICAL INSTRUCTIONS:**
    1.  **Prioritize User Input:** This is the most important rule. Always use the details explicitly mentioned in the user's request. Do not override them with a default.
    2.  **Apply Smart Defaults:** Only if a detail is COMPLETELY MISSING from the request, use the following defaults:
        - **Region:** {region_instruction}
        - **Product:** "saree"
        - **Occasion:** "daily use"

    Respond ONLY with a single, valid JSON object. Do not add any other text.

    ---
    User Request: "{raw_input}"
    """

    response = call_llm(prompt)
    
    # Clean the response string before parsing
    cleaned_response = response.strip()
    if cleaned_response.startswith("```json"):
        cleaned_response = cleaned_response[7:-3].strip()
    elif cleaned_response.startswith("```"):
        cleaned_response = cleaned_response[3:-3].strip()
        
    try:
        # The LLM now handles all defaults, so we just parse and return.
        data = json.loads(cleaned_response)
        return data
        
    except (json.JSONDecodeError, TypeError):
        print("❌ Could not parse structured output. Returning basic defaults.")
        print(f"Raw response was: '{response}'")
        
        # Basic fallback if LLM output is completely broken
        return {
            "region": "India",
            "product": "saree",
            "occasion": "daily use"
        }