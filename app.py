import os
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
from google import genai
from google.genai import types

app = Flask(__name__)
load_dotenv()

# Konfigurasi client langsung (tanpa genai.configure)
client = genai.Client(
    vertexai=True,
    project=os.getenv("VERTEX_PROJECT_ID"),
    location="us-central1",
)

SYSTEM_PROMPT = (os.getenv("VERTEX_SYSTEM_PROMPT"))

@app.route("/")
def index():
    return render_template("index.html")

from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/blog")
def blog():
    return render_template("blog.html")

@app.route("/generate", methods=["POST"])
def generate():
    user_input = request.form.get("user_input", "")
    if not user_input.strip():
        return jsonify({"response": "Mohon masukkan pesan terlebih dahulu."})

    try:
        contents = [
            types.Content(
                role="user",
                parts=[types.Part(text=f"{SYSTEM_PROMPT}\n\n{user_input}")]
            )
        ]

        generate_content_config = types.GenerateContentConfig(
            temperature=1.0,
            top_p=0.95,
            max_output_tokens=2048,
            safety_settings=[
                types.SafetySetting(category="HARM_CATEGORY_HATE_SPEECH", threshold="OFF"),
                types.SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT", threshold="OFF"),
                types.SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold="OFF"),
                types.SafetySetting(category="HARM_CATEGORY_HARASSMENT", threshold="OFF"),
            ],
        )

        response_text = ""
        for chunk in client.models.generate_content_stream(
            model=os.getenv("VERTEX_MODEL_NAME"),
            contents=contents,
            config=generate_content_config,
        ):
            if chunk.text:
                response_text += chunk.text

        return jsonify({"response": response_text})

    except Exception as e:
        return jsonify({"response": f"Terjadi kesalahan: {str(e)}"})

if __name__ == "__main__":
    app.run(debug=True)
