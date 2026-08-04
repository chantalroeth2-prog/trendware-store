const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

interface GroqOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export async function callGroq(
  prompt: string,
  options: GroqOptions = {}
): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY fehlt.");

  const {
    temperature = 0.7,
    maxTokens = 4096,
    model = DEFAULT_MODEL,
  } = options;

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq Fehler: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}
