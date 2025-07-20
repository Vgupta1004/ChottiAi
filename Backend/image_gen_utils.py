# from diffusers import StableDiffusionPipeline
# import torch
# import os

# pipe = StableDiffusionPipeline.from_pretrained(
#     "stabilityai/stable-diffusion-xl-base-1.0",
#     torch_dtype=torch.float16
# ).to("cuda" if torch.cuda.is_available() else "cpu")

# def generate_image(prompt, filename="output.png"):
#     image = pipe(prompt).images[0]
#     image.save(filename)
#     return filename

# import os
# import requests

# HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
# API_URL = "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4"
# HEADERS = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}

# def generate_image_from_prompt(prompt, output_filename="output.png"):
#     response = requests.post(API_URL, headers=HEADERS, json={"inputs": prompt})
#     if response.status_code == 200:
#         with open(output_filename, "wb") as f:
#             f.write(response.content)
#         print(f"✅ Image saved as {output_filename}")
#         return output_filename
#     else:
#         print("❌ Error:", response.status_code, response.text)
#         return None


# image_gen_utils.py

# import os
# from huggingface_hub import InferenceClient

# HF_TOKEN = os.getenv("HUGGINGFACE_API_KEY")
# client = InferenceClient(token=HF_TOKEN)

# def generate_image_from_prompt(prompt, filename="output.png"):
#     try:
#         image = client.text_to_image(prompt=prompt, guidance_scale=7.5)
#         image.save(filename)
#         print(f"✅ Saved: {filename}")
#         return filename
#     except Exception as e:
#         print("❌ HF error:", e)
#         return None


import os
from huggingface_hub import InferenceClient

# FIX 1: Make sure you are using the correct variable name from your .env and Render settings.
HF_TOKEN = os.getenv("HF_TOKEN")
client = InferenceClient(token=HF_TOKEN)

def generate_image_from_prompt(prompt, filename="output.png"):
    try:
        # FIX 2: Explicitly use a smaller, more memory-efficient image model.
        image = client.text_to_image(
            prompt,
            model="runwayml/stable-diffusion-v1-5", # A smaller, more stable model
            guidance_scale=7.5
        )
        image.save(filename)
        print(f"✅ Saved: {filename}")
        return filename
    except Exception as e:
        print("❌ HF error:", e)
        return None