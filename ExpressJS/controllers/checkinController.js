require('dotenv').config();

const Checkin = require('../models/Checkin');
const { AzureOpenAI } = require('openai');

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const modelName = process.env.AZURE_OPENAI_MODEL_NAME;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

const options = { endpoint, apiKey, deployment, apiVersion }
const client = new AzureOpenAI(options);

exports.checkin = async (req, res) => {
  const { mood, description } = req.body;
  const checkin = new Checkin({ userId: req.userId, mood, description });
  await checkin.save();
  res.json({ message: 'Check-in saved' });
};

exports.getCheckins = async (req, res) => {
  const checkins = await Checkin.find({ userId: req.userId }).sort({ date: -1 });
  res.json(checkins);
};

exports.getRecommendation = async (req, res) => {
  const recentCheckins = await Checkin.find({ userId: req.userId }).sort({ date: -1 }).limit(3);
  if (recentCheckins.length === 0) return res.status(400).json({ message: 'No check-ins found' });

  const descriptions = recentCheckins
    .map(c => `Tanggal: ${c.date.toDateString()}, Mood: ${c.mood}, Deskripsi: ${c.description}`)
    .join('\n');

  const prompt = `Berikut ini adalah catatan mood harian seseorang selama 3 hari terakhir:\n\n${descriptions}\n\nBerdasarkan data tersebut, berikan analisis singkat tentang kondisi emosional orang ini dan rekomendasi aktivitas yang sesuai untuk membantu menjaga atau meningkatkan suasana hati mereka.\n\nLangsung jawab dengan kalimat yang dituju ke user tersebut dan dapat berupa paragraf dan poin-poin.`;

  try {
    const response = await client.chat.completions.create({
      max_tokens: 1024,
      temperature: 1,
      top_p: 1,
      model: modelName,
      messages: [{ role: 'user', content: prompt }],
    });

    const output = response.choices[0].message.content;
    res.json({ recommendation: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'LLM analysis failed' });
  }
};
