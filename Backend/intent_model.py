# def classify_intent(raw_input):
#     raw_input = raw_input.lower()
#     if any(w in raw_input for w in ["design", "idea", "pattern"]):
#         return "design"
#     elif any(w in raw_input for w in ["tutorial", "steps", "how to"]):
#         return "tutorial"
#     elif any(w in raw_input for w in ["catalog", "sell", "listing"]):
#         return "catalog"
#     else:
#         return "general"

# intent_model.py

# from llm_utils import call_llm

# INTENT_OPTIONS = ["design", "tutorial", "catalog", "general"]

# def classify_intent(user_input):
#     prompt = f"""
# You are an intent classifier for an AI assistant helping artisans.

# Classify the user's intent into one of these categories:
# - design → if they want design ideas or inspiration.
# - tutorial → if they want to learn how to make something.
# - catalog → if they need help writing a product description or listing.
# - general → if it’s too vague or doesn’t fit any above.

# Just return one word: design, tutorial, catalog, or general.

# User Input:
# \"\"\"{user_input}\"\"\"
# Intent:"""

#     response = call_llm(prompt)
#     intent = response.strip().lower()
    
#     if intent in INTENT_OPTIONS:
#         return intent
#     else:
#         return "general"  # fallback


# intent_model.py

from llm_utils import call_llm

INTENT_OPTIONS = ["design", "tutorial", "catalog", "general"]

def classify_intent(user_input):
    # This new prompt includes examples to guide the AI, making it more accurate.
    prompt = f"""
    You are an expert intent classifier for an AI assistant helping artisans. Classify the user's intent into one of these four categories: design, tutorial, catalog, or general. 
    Return only the single-word category name.

    ---
    Here are some examples to guide you:

    User Input: "Give me some ideas for a wedding saree"
    Intent: design

    User Input: "How do I make a terracotta pot?"
    Intent: tutorial
    
    User Input: "I want to learn basket weaving step by step"
    Intent: tutorial

    User Input: "Help me write a product listing for my Madhubani painting"
    Intent: catalog

    User Input: "What is the history of block printing?"
    Intent: general
    ---

    Now, classify the following new input:

    User Input:
    \"\"\"{user_input}\"\"\"
    Intent:"""

    response = call_llm(prompt, temperature=0.1) # Lower temp for classification
    intent = response.strip().lower()
    
    # Clean up any extra text the model might add
    for valid_intent in INTENT_OPTIONS:
        if valid_intent in intent:
            return valid_intent
            
    return "general"  # Fallback just in case