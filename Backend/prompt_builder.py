def build_claude_prompt(intent, region, product, occasion):
    if intent == "design":
        return f"""You are a cultural design expert. The artisan is from {region}, and wants to make a {product} for {occasion}.
Suggest 2-3 deeply rooted authentic design ideas. Include motifs, colors, stitching, and cultural meanings.

### Format:
Respond in the following strict format only:

### 1. <Design Title>
<Description explaining the design idea, motifs, colors, stitches, and cultural symbolism>

### 2. <Design Title>
<Description>

### 3. <Design Title>
<Description>

Only output the design ideas using this format. Do not include introductions or explanations outside the format.
"""
    
    elif intent == "tutorial":
        return f"""You are a master craft teacher. Help an artisan from {region} create a {product} for {occasion}.
Provide a beginner-friendly step-by-step guide. Include tools, materials, and cultural notes.
"""
    
    elif intent == "catalog":
        return f"""You are a product catalog writing expert. Help an artisan from {region} sell a {product} for {occasion}.
Give an attractive title, description, 3-4 keywords, and styling tips to maximize profit.
"""
    
    else:
        return f"User needs help with a {product} for {occasion} from {region}. Give your best advice."
