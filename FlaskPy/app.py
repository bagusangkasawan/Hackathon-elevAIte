import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_restx import Api, Resource, fields, Namespace
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

app = Flask(__name__)
CORS(app)

if os.getenv("GOOGLE_CREDENTIALS_JSON"):
    with open("service_account.json", "w") as f:
        f.write(os.getenv("GOOGLE_CREDENTIALS_JSON"))
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "service_account.json"

client = genai.Client(
    vertexai=True,
    project=os.getenv("VERTEX_PROJECT_ID"),
    location="us-central1",
)

safety_settings=[
                types.SafetySetting(category="HARM_CATEGORY_HATE_SPEECH", threshold="OFF"),
                types.SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT", threshold="OFF"),
                types.SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold="OFF"),
                types.SafetySetting(category="HARM_CATEGORY_HARASSMENT", threshold="OFF"),
            ]

system_prompt = (os.getenv("VERTEX_SYSTEM_PROMPT"))

model=os.getenv("VERTEX_MODEL_NAME")

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
                parts=[types.Part(text=f"{system_prompt}\n\n{user_input}")]
            )
        ]

        generate_content_config = types.GenerateContentConfig(
            temperature=1.0,
            top_p=0.95,
            max_output_tokens=2048,
            safety_settings=safety_settings
        )

        response_text = ""
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            if chunk.text:
                response_text += chunk.text

        return jsonify({"response": response_text})

    except Exception as e:
        return jsonify({"response": f"Terjadi kesalahan: {str(e)}"})
    
app.config['SWAGGER_UI_DOC_EXPANSION'] = 'full'

api = Api(
    app,
    version='1.0',
    title='MentalMate Chatbot API',
    description = (
    "Selamat datang di dokumentasi MentalMate Chatbot API.\n"
    "API ini memungkinkan pengguna untuk berinteraksi dengan asisten virtual berbasis AI.\n\n"
    "Fitur utama:\n"
    "- Konsultasi seputar kesehatan mental\n"
    "- Rekomendasi aktivitas positif\n\n"
    "Gunakan endpoint /api/generate untuk memulai percakapan."
    ),
    doc='/api/docs'
)

chat_ns = Namespace(
    'Chatbot',
    description='Interaksi dengan chatbot MentalMate berbasis Vertex AI'
)

chat_input_model = chat_ns.model('ChatInput', {
    'user_input': fields.String(
        required=True,
        description='Pesan dari pengguna',
        example='Saya sedang stres, apa yang harus saya lakukan?'
    )
})

@chat_ns.route('/generate')
class ChatEndpoint(Resource):
    @chat_ns.expect(chat_input_model)
    @chat_ns.response(200, 'Berhasil mendapatkan respon.')
    @chat_ns.response(500, 'Terjadi kesalahan pada server.')
    def post(self):
        """Mengirim pertanyaan ke chatbot dan menerima respon dari Vertex AI."""
        try:
            data = request.get_json()
            user_input = data.get("user_input", "")
            if not user_input.strip():
                return jsonify({"response": "Mohon masukkan pesan terlebih dahulu."})

            try:
                contents = [
                    types.Content(
                        role="user",
                        parts=[types.Part(text=f"{system_prompt}\n\n{user_input}")]
                    )
                ]

                generate_content_config = types.GenerateContentConfig(
                    temperature=1.0,
                    top_p=0.95,
                    max_output_tokens=2048,
                    safety_settings=safety_settings
                )

                response_text = ""
                for chunk in client.models.generate_content_stream(
                    model=model,
                    contents=contents,
                    config=generate_content_config,
                ):
                    if chunk.text:
                        response_text += chunk.text

                return jsonify({"response": response_text})

            except Exception as e:
                return jsonify({"response": f"Terjadi kesalahan: {str(e)}"})
            
        except Exception as e:
            print(f"Error occurred: {e}")
            return {'error': 'Internal server error'}, 500
    
api.add_namespace(chat_ns, path='/api')

if __name__ == "__main__":
    app.run(debug=True)
