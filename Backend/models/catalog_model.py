 
from llm_utils import call_llm
from prompt_builder import build_claude_prompt

def run_catalog_model(region, product, occasion):
    prompt = build_claude_prompt("catalog", region, product, occasion)
    return call_llm(prompt)
