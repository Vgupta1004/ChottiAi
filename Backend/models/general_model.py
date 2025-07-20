# general_model.py

from llm_utils import call_llm

def run_general_model(user_input):
    prompt = f"""
The user said:
\"\"\"{user_input}\"\"\"

They are an artisan or craftsperson from a rural area or traditional background. Give a helpful, creative response — suggest either:
- how to turn it into a design idea,
- how they could use this thought in a product or cultural item,
- or guide them toward something creative or specific.

Give culturally aware and practical advice.
"""
    response = call_llm(prompt)
    return response
