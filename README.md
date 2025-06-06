# 🧠 MentalMate – Backend Services

MentalMate adalah aplikasi pendukung kesehatan mental dengan fitur mood tracking, chatbot AI bilingual, dan analisis emosi.  
Proyek ini terdiri dari dua layanan backend:

- `/ExpressJS`: Backend utama (user, check-in, integrasi Azure)
- `/FlaskPy`: Backend chatbot (serve Gemini via Vertex AI GCP)

---

## 📁 Struktur Direktori

```

/
├── ExpressJS/   → REST API untuk autentikasi, mood check-in, dan Azure
├── FlaskPy/     → API chatbot Gemini (Vertex AI) via Flask
└── README.md    → Dokumentasi

````

---

## 🔧 1. ExpressJS – REST API (Node.js + Express)

### 📦 Fitur Utama
- Registrasi & login user dengan JWT
- Update profil user (username/password)
- Pelacakan suasana hati harian (daily mood check-in)
- Rekomendasi aktivitas berdasarkan riwayat mood
- Integrasi Azure AI untuk analisis lanjutan (opsional)

### 🚀 Menjalankan

```bash
cd ExpressJS
npm install
npm run dev
````

### ⚙️ Environment Variables (contoh `.env`)

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
AZURE_API_KEY=your_azure_api_key
AZURE_ENDPOINT=https://your-azure-endpoint
```

---

### 📮 Endpoint API

#### 🛡️ Auth – Registrasi, Login, dan Update Profil

| Method | Endpoint               | Deskripsi                              |
| ------ | ---------------------- | -------------------------------------- |
| POST   | `/auth/register`       | Registrasi user baru                   |
| POST   | `/auth/login`          | Login dan mendapatkan JWT token        |
| PUT    | `/auth/update-profile` | Update username dan/atau password user |

#### 📆 Check-in – Mood Harian & Rekomendasi

| Method | Endpoint                  | Deskripsi                                                           |
| ------ | ------------------------- | ------------------------------------------------------------------- |
| POST   | `/checkin`                | Submit check-in mood harian                                         |
| GET    | `/checkin`                | Ambil semua data check-in user                                      |
| GET    | `/checkin/recommendation` | Dapatkan analisis mood & rekomendasi aktivitas dari 3 mood terakhir |

---

## 🤖 2. FlaskPy – Chatbot API (Flask + Gemini via Vertex AI)

### 📦 Fitur Utama

* Menyediakan endpoint API untuk chatbot Gemini dari Google Cloud Vertex AI
* Chatbot bilingual (ID & EN), di-*fine-tune* untuk topik kesehatan mental ringan
* Input berupa teks user, output berupa respons Gemini
* Aman, ringan, dan mudah diintegrasikan ke frontend seperti React

### 🚀 Menjalankan

```bash
cd FlaskPy
pip install -r requirements.txt
python app.py
```

### ⚙️ Environment Variables (contoh `.env`)

```env
PORT=8080
GEMINI_API_KEY=your_gcp_service_account_key
PROJECT_ID=your_gcp_project_id
REGION=your_gcp_region
```

### 📤 Contoh Request & Respons

```json
POST /generate
{
  "message": "Saya sering merasa cemas belakangan ini"
}
```

```json
Response:
{
  "reply": "Tidak apa-apa merasa cemas. Ingin saya bantu dengan beberapa tips relaksasi?"
}
```

---

## 📌 Catatan Tambahan

* **Chatbot tidak menggunakan model lokal**, melainkan menyambungkan permintaan user ke model **Gemini (Vertex AI)** di GCP.
* Penggunaan Gemini sudah di-*fine-tune* atau disesuaikan dengan konteks MentalMate agar lebih relevan dan suportif.
* Jangan lupa mengatur autentikasi layanan GCP untuk keperluan deployment.
