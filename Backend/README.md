# ChottiAI v2

ChottiAI v2 is an AI-powered assistant designed to extract structured information from user input, generate prompts, and support image generation for Indian cultural products. It leverages LLMs (Large Language Models) and integrates with various utilities for intent detection, prompt building, and image generation.

## Features

- **Structured Info Extraction:** Extracts region, product, and occasion from free-form user input using LLMs.
- **Prompt Building:** Dynamically builds prompts for LLMs and image generation models.
- **Image Generation:** Supports image generation using models like DeepFloyd and Diffusers.
- **Intent Detection:** Classifies user intent to route requests appropriately.
- **Extensible Models:** Modular design for catalog, design, general, and tutorial models.

## Project Structure

```
├── image_gen_utils.py         # Utilities for image generation
├── intent_model.py           # Intent detection logic
├── llm_utils.py              # LLM call and utility functions
├── main.py                   # Main entry point (if applicable)
├── prompt_builder.py         # Prompt construction logic
├── inputs/
│   ├── llm_extract_info.py   # Extracts structured info from user input
│   └── user_input.json       # Stores last parsed user input
├── models/
│   ├── catalog_model.py      # Catalog-related model logic
│   ├── design_model.py       # Design-related model logic
│   ├── general_model.py      # General-purpose model logic
│   └── tutorial_model.py     # Tutorial-related model logic
├── env/                      # Python virtual environment
└── __pycache__/              # Python bytecode cache
```

## Setup

1. **Clone the repository:**
   ```powershell
   git clone <repo-url>
   cd chottiAi_v2
   ```

2. **Create and activate a virtual environment:**
   ```powershell
   python -m venv env
   .\env\Scripts\activate
   ```

3. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```
   *(If `requirements.txt` is missing, install packages as needed: `diffusers`, `accelerate`, `huggingface_hub`, etc.)*

## Usage

- **Extract Structured Info:**
  Use `inputs/llm_extract_info.py` to extract region, product, and occasion from user input. The result is saved to `inputs/user_input.json`.

- **Image Generation:**
  Use `image_gen_utils.py` and related scripts to generate images based on prompts.

- **Intent Detection & Prompt Building:**
  Use `intent_model.py` and `prompt_builder.py` for advanced LLM workflows.

## Customization

- Add new models in the `models/` directory.
- Update prompt logic in `prompt_builder.py`.
- Extend LLM utilities in `llm_utils.py`.

## License

Specify your license here (e.g., MIT, Apache 2.0, etc.).

## Acknowledgements

- [Hugging Face Diffusers](https://github.com/huggingface/diffusers)
- [DeepFloyd](https://github.com/deep-floyd/IF)
- OpenAI, Anthropic Claude, and other LLM providers

---
*For questions or contributions, please open an issue or pull request.*
