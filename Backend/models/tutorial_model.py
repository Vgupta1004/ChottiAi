 
# # from llm_utils import call_llm
# # from image_gen_utils import generate_image_from_prompt
# # from prompt_builder import build_claude_prompt

# # def run_tutorial_model(region, product, occasion):
# #     prompt = build_claude_prompt("tutorial", region, product, occasion)
# #     response = call_llm(prompt)
# #     image_file = generate_image_from_prompt(f"step-by-step {product} tutorial for {occasion} from {region}", "tutorial.png")
# #     return response, image_file


# # models/tutorial_model.py

# # import re
# # from llm_utils import call_llm
# # from image_gen_utils import generate_image_from_prompt
# # from prompt_builder import build_claude_prompt
# # from PIL import Image

# # def run_tutorial_model(region, product, occasion):
# #     prompt = build_claude_prompt("tutorial", region, product, occasion)
# #     response = call_llm(prompt)

# #     # 🔍 Extract steps from the LLM response
# #     step_titles = re.findall(r"####?\s+\*?\*?Step\s*\d+[:\-]?[^\n]*", response)

# #     image_files = []
# #     for i, title in enumerate(step_titles):
# #         short_desc = title.replace("####", "").replace("**", "").strip()
# #         step_prompt = f"{short_desc}, as part of a traditional {product} tutorial from {region} for {occasion}"
# #         filename = f"tutorial_step_{i+1}.png"
# #         image = generate_image_from_prompt(step_prompt, filename)
# #         if image:
# #             image_files.append(image)

# #     # 🌀 Optional: Create a GIF from the image sequence
# #     if image_files:
# #         create_gif(image_files, "tutorial_animation.gif")

# #     return response, image_files

# # def create_gif(image_files, output_path="tutorial_animation.gif"):
# #     try:
# #         images = [Image.open(img).convert("RGB") for img in image_files]
# #         images[0].save(output_path, save_all=True, append_images=images[1:], duration=1500, loop=0)
# #         print(f"✅ GIF saved: {output_path}")
# #     except Exception as e:
# #         print("❌ GIF creation error:", e)


# # models/tutorial_model.py

# # import re
# # from llm_utils import call_llm
# # from image_gen_utils import generate_image_from_prompt
# # from prompt_builder import build_claude_prompt
# # from PIL import Image

# # def run_tutorial_model(region, product, occasion):
# #     prompt = build_claude_prompt("tutorial", region, product, occasion)
# #     tutorial_text = call_llm(prompt)

# #     # 🔍 Extract step titles (headings like "#### **Step 1: Draw the outline**")
# #     steps = re.findall(r"####\s\*\*(.*?)\*\*", tutorial_text)
# #     if not steps:
# #         steps = [f"Step {i+1}" for i in range(4)]

# #     base_prompt = f"{product} crafting tutorial in {region} style for {occasion}, step:"
# #     image_files = []

# #     for idx, step in enumerate(steps[:6]):
# #         step_prompt = f"{base_prompt} {step}"
# #         filename = f"tutorial_step_{idx+1}.png"
# #         path = generate_image_from_prompt(step_prompt, filename)
# #         if path:
# #             image_files.append(path)

# #     # 🎞️ Optional: create GIF of tutorial steps
# #     if image_files:
# #         create_gif(image_files, "tutorial_animation.gif")

# #     return tutorial_text, image_files

# # def create_gif(image_files, output_path="tutorial_animation.gif"):
# #     try:
# #         images = [Image.open(img).convert("RGB") for img in image_files]
# #         images[0].save(output_path, save_all=True, append_images=images[1:], duration=1500, loop=0)
# #         print(f"✅ GIF saved: {output_path}")
# #     except Exception as e:
# #         print("❌ GIF creation error:", e)

# # models/tutorial_model.py

# from llm_utils import call_llm
# from prompt_builder import build_claude_prompt

# def run_tutorial_model(region, product, occasion):
#     prompt = build_claude_prompt("tutorial", region, product, occasion)
#     tutorial_text = call_llm(prompt)
#     return tutorial_text, []  # return empty list of images

# models/tutorial_model.py

from llm_utils import call_llm

def run_tutorial_model(user_query: str):
    """
    Generates a step-by-step tutorial based on the user's direct query.
    """
    prompt = f"""
    You are a helpful teacher who provides clear, step-by-step tutorials.
    A user wants to learn how to do something. Provide a detailed, beginner-friendly tutorial for the following request.
    Break the process down into simple, logical steps.

    User's Request: "{user_query}"
    """
    tutorial_text = call_llm(prompt)
    
    # Return the tutorial text and an empty list for images
    return tutorial_text, []