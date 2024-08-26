import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { agent_id, metadata, retell_llm_dynamic_variables } = req.body;
  const apiKey = process.env.RETELL_API;

  const payload = { agent_id };
  if (metadata) payload.metadata = metadata;
  if (retell_llm_dynamic_variables) payload.retell_llm_dynamic_variables = retell_llm_dynamic_variables;

  try {
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create web call');
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating web call:', error);
    res.status(500).json({ error: 'Failed to create web call' });
  }
}
