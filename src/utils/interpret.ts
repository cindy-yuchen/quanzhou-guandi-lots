import { Lot } from './lots';

const FALLBACK =
  "师傅此刻正在静修，未能解签。请稍后再试，或自行参悟签诗之意。关圣帝君庇佑。";

export async function interpretLot(question: string, lot: Lot): Promise<string> {
  try {
    const resp = await fetch("/api/interpret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, lot }),
    });
    const data = (await resp.json()) as { text?: string };
    return data?.text || FALLBACK;
  } catch (error) {
    console.error("Interpret API Error:", error);
    return FALLBACK;
  }
}
