import guandiLots from '../data/guandi_lots.json';

export interface Lot {
  number: number;
  level: string;
  poem: string[];
  meaning: string;
  story?: string;
}

export const LOTS: Lot[] = guandiLots.signs.map((sign: any) => ({
  number: sign.id,
  level: sign.fortune,
  poem: sign.poem_lines,
  meaning: sign.meaning,
  story: sign.story
}));

export const getRandomLot = () => LOTS[Math.floor(Math.random() * LOTS.length)];
