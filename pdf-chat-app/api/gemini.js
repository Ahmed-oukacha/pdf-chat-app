// /api/gemini.js

export default async function handler(req, res) {
  // التأكد من أن الطلب هو POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { prompt } = req.body;
    // جلب المفتاح من متغيرات البيئة الآمنة في Vercel
    const openaiApiKey = process.env.OPENAI_API_KEY; 

    if (!openaiApiKey) {
      throw new Error('Missing OpenAI API Key on the server');
    }

    const openaiUrl = 'https://api.openai.com/v1/chat/completions';

    const response = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        // لا ترسل الخطأ الكامل للمستخدم، فقط رسالة عامة
        console.error('OpenAI API Error:', errorData);
        res.status(response.status).json({ error: 'Failed to fetch from OpenAI API' });
        return;
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ error: error.message });
  }
}
