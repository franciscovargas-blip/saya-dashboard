export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: 'API key not configured in Vercel' });

  try {
    const { message, context } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: 'Eres el CFO de Saya Biologics, una startup de biologics/pharma en México. Respondes preguntas sobre el rolling forecast y gastos en español. Sé conciso (máx 3 párrafos). Usa números del contexto. Habla en primera persona plural. Identifica drivers, riesgos y oportunidades.',
        messages: [{ role: 'user', content: 'Contexto financiero:\n' + context + '\n\nPregunta: ' + message }],
      }),
    });
    const data = await response.json();
    const text = data.content?.map(c => c.text || '').join('') || 'Sin respuesta.';
    res.status(200).json({ response: text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
