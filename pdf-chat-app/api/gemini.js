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
    const geminiApiKey = process.env.GEMINI_API_KEY; 

    if (!geminiApiKey) {
      throw new Error('Missing Gemini API Key on the server');
    }

    const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

    const response = await fetch(googleApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        // لا ترسل الخطأ الكامل للمستخدم، فقط رسالة عامة
        console.error('Google API Error:', errorData);
        res.status(response.status).json({ error: 'Failed to fetch from Google API' });
        return;
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ error: error.message });
  }
}
