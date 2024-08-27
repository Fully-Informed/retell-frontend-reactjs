import fetch from 'node-fetch';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

export default async function handler(req, res) {
  console.log("Handler called with body:", JSON.stringify(req.body));
  
  const { agent_id, metadata, retell_llm_dynamic_variables } = req.body;
  const apiKey = process.env.RETELL_API;

  console.log("Agent ID:", agent_id);
  console.log("API Key (first 4 chars):", apiKey ? apiKey.substring(0, 4) : "undefined");

  const payload = { agent_id };
  if (metadata) payload.metadata = metadata;
  if (retell_llm_dynamic_variables) payload.retell_llm_dynamic_variables = retell_llm_dynamic_variables;

  console.log("Payload:", JSON.stringify(payload));

  try {
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log("Retell API response status:", response.status);

    const data = await response.json();
    console.log("Retell API response data:", JSON.stringify(data));

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create web call');
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating web call:', error);
    res.status(500).json({ error: 'Failed to create web call', details: error.message });
  }
}