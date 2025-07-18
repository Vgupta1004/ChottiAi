import json
from intent_model import classify_intent
from models.design_model import run_design_model
from models.tutorial_model import run_tutorial_model
from models.catalog_model import run_catalog_model

with open("inputs/user_input.json") as f:
    user_data = json.load(f)

intent = classify_intent(user_data["raw_input"])
region, product, occasion = user_data["region"], user_data["product"], user_data["occasion"]

print(f"[Intent]: {intent}\n")

text = ""
images = []

if intent == "design":
    text, img = run_design_model(region, product, occasion)
    if img:
        images = [img]
elif intent == "tutorial":
    text, images = run_tutorial_model(region, product, occasion)
    # print("[Claude Output]:\n", text)
    if images:
        for img in images:
            print(f"🖼️ Image saved at: {img}")

elif intent == "catalog":
    text = run_catalog_model(region, product, occasion)
    images = []
else:
    text = "Could not classify intent."
    images = []

print("[Claude Output]:\n", text)

if images:
    for img_path in images:
        print("🖼️ Image saved at:", img_path)
