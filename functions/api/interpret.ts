type Env = {
  DEEPSEEK_API_KEY?: string;
  DEEPSEEK_MODEL?: string;
};

type Context = {
  request: Request;
  env: Env;
};

type LotData = {
  number?: number;
  level?: string;
  poem?: string[];
  meaning?: string;
  story?: string;
};

const FALLBACK =
  "师傅此刻正在静修，未能解签。请稍后再试，或自行参悟签诗之意。关圣帝君庇佑。";

function buildPrompt(question: string, lot: LotData): string {
  return `
你现在是泉州通淮关岳庙中一位德高望重、慈悲为怀的解签师傅。
一位香客带着诚心来求签，他/她的问题是：“${question}”
神明赐下的签诗是第${lot.number}签，签文为：
${(lot.poem || []).join("，")}。
签诗的传统字面含义是：${lot.meaning}
${lot.story ? `此签的典故是：${lot.story}` : ""}

请你作为解签师傅，用温和、抚慰、充满传统文化温度的语气，为这位香客解开这支签的深意。
要求：
1. 语气要像一位长者，称呼对方为“善信”或“香客”。
2. 结合他/她的具体问题，将签文的意象与现实生活联系起来。
3. 给出具体、可操作且充满善意的建议。
4. 结尾要给予祝福，例如“关圣帝君庇佑，愿你...”。
5. 篇幅适中，不要过于冗长，分段清晰。
`;
}

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  const key = env.DEEPSEEK_API_KEY;
  const model = env.DEEPSEEK_MODEL || "deepseek-chat";

  if (!key) {
    return json({ text: FALLBACK, error: "DEEPSEEK_API_KEY not configured" }, 500);
  }

  let body: { question?: string; lot?: LotData };
  try {
    body = (await request.json()) as { question?: string; lot?: LotData };
  } catch {
    return json({ text: FALLBACK, error: "invalid json" }, 400);
  }

  const prompt = buildPrompt(body.question || "", body.lot || {});

  try {
    const resp = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        stream: false,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return json({ text: FALLBACK, error: errText.slice(0, 500) }, 502);
    }

    const data = (await resp.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text: string = data?.choices?.[0]?.message?.content || FALLBACK;
    return json({ text });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return json({ text: FALLBACK, error: message }, 500);
  }
}
