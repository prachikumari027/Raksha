import axios from 'axios';

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
      });
    }

    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const botReply =
      geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No reply from Gemini';

    return new Response(JSON.stringify({ botReply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    return new Response(JSON.stringify({ error: 'Gemini API call failed' }), {
      status: 500,
    });
  }
}
