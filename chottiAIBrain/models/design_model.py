 
from llm_utils import call_llm
from image_gen_utils import generate_image_from_prompt
from prompt_builder import build_claude_prompt

def run_design_model(region, product, occasion):
    prompt = build_claude_prompt("design", region, product, occasion)
    response = call_llm(prompt)
    image_file = generate_image_from_prompt(f"{occasion} {product} in {region} traditional style", "design.png")
    return response, image_file
