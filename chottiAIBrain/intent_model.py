def classify_intent(raw_input):
    raw_input = raw_input.lower()
    if any(w in raw_input for w in ["design", "idea", "pattern"]):
        return "design"
    elif any(w in raw_input for w in ["tutorial", "steps", "how to"]):
        return "tutorial"
    elif any(w in raw_input for w in ["catalog", "sell", "listing"]):
        return "catalog"
    else:
        return "general"

