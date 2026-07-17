import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: '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',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function main() {
  console.log('Sending request to z-ai/glm-5.2...');
  const start = Date.now();
  
  try {
    const response = await openai.chat.completions.create({
      model: 'z-ai/glm-5.2',
      messages: [
        { role: 'system', content: 'You are an expert computational epigrapher. Please return a JSON object with {"status": "ok"}' },
        { role: 'user', content: `Analyze this inscription:\ndonat in ??????????rtis` }
      ],
      temperature: 0.2,
      max_tokens: 500,
    });

    console.log('Response received in', (Date.now() - start) / 1000, 'seconds');
    console.log('Response:', response.choices[0]?.message?.content);
  } catch (err: any) {
    console.error('Error:', err.message);
  }
}

main();
