 
# from llm_utils import call_llm
# from image_gen_utils import generate_image_from_prompt
# from prompt_builder import build_claude_prompt

# def run_design_model(region, product, occasion):
#     prompt = build_claude_prompt("design", region, product, occasion)
#     response = call_llm(prompt)
#     image_file = generate_image_from_prompt(f"{occasion} {product} in {region} traditional style", "design.png")
#     return response, image_file

# import re
# from llm_utils import call_llm
# from image_gen_utils import generate_image_from_prompt
# from prompt_builder import build_claude_prompt

# def extract_idea_titles(text):
#     # Extract headers like '### 1. <Title>'
#     return re.findall(r"###\s*\d+\.\s*(.*?)\n", text)
#     # return re.findall(r"###\s*\*{0,2}\d+\.?\s*\*{0,2}(.*?)\*{0,2}\s*\n", text)

# def run_design_model(region, product, occasion):
#     prompt = build_claude_prompt("design", region, product, occasion)
#     response = call_llm(prompt)

#     idea_titles = extract_idea_titles(response)
#     print("[✅] Extracted titles:", idea_titles)

#     image_files = []

#     for i, title in enumerate(idea_titles):
#         clean_title = re.sub(r"[^\w\s-]", "", title).strip().replace(" ", "_").lower()
#         image_prompt = f"{title} for a {product} in {region} style during {occasion}"
#         image_file = generate_image_from_prompt(image_prompt, f"design_{i+1}_{clean_title}.png")
#         image_files.append(image_file)

#     return response, image_files


# models/design_model.py

import re
import os
from llm_utils import call_llm
from image_gen_utils import generate_image_from_prompt
from prompt_builder import build_claude_prompt
from llm_utils import call_llm, format_text_as_markdown

def extract_idea_titles(text):
    # This function does not need to be changed
    return re.findall(r"###\s*\d+\.\s*(.*?)\n", text)



def run_design_model(region, product, occasion):
    prompt = build_claude_prompt("design", region, product, occasion)
    response = call_llm(prompt)
    formatted_response = format_text_as_markdown(response)

    idea_titles = extract_idea_titles(response)
    print("[✅] Extracted titles:", idea_titles)

    image_url_paths = []

    # --- NEW, MORE ROBUST PATH LOGIC ---

    # 1. Define the absolute path to the target directory for images.
    # This finds the directory of the current script (models/), goes one level up (to backend/),
    # and then points to the generated_images/ folder. This is much safer.
    save_directory = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'generated_images'))

    # 2. Ensure this directory exists, creating it if it doesn't.
    os.makedirs(save_directory, exist_ok=True)

    for i, title in enumerate(idea_titles):
        clean_title = re.sub(r"[^\w\s-]", "", title).strip().replace(" ", "_").lower()
        image_prompt = f"{title} for a {product} in {region} style during {occasion}"
        
        base_filename = f"design_{i+1}_{clean_title}.png"
        
        # 3. Create the full, absolute path for saving the file.
        local_save_path = os.path.join(save_directory, base_filename)
        
        # 4. The URL path for the frontend remains the same.
        url_path_for_frontend = f"/static/{base_filename}"

        # 5. Generate and save the image to the absolute path.
        generate_image_from_prompt(image_prompt, local_save_path)
        
        image_url_paths.append(url_path_for_frontend)
        
    return formatted_response, image_url_paths