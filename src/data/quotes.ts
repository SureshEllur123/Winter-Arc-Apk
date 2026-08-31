import { MotivationQuote } from '../types';

export const WINTER_ARC_QUOTES: MotivationQuote[] = [
  {
    id: 1,
    quote: "Discipline beats motivation every single time.",
    author: "Winter Arc Principle",
    theme: "discipline"
  },
  {
    id: 2,
    quote: "One more day. Stay locked in.",
    author: "Winter Arc Creed",
    theme: "grit"
  },
  {
    id: 3,
    quote: "Small wins become big changes.",
    author: "Consistency Code",
    theme: "consistency"
  },
  {
    id: 4,
    quote: "You showed up today. That's the win.",
    author: "Daily Affirmation",
    theme: "focus"
  },
  {
    id: 5,
    quote: "While the world sleeps in winter, champions are forged in silence.",
    author: "Winter Arc Doctrine",
    theme: "grit"
  },
  {
    id: 6,
    quote: "Do what needs to be done, especially when you don't feel like it.",
    author: "Stoic Discipline",
    theme: "discipline"
  },
  {
    id: 7,
    quote: "Comfort is the enemy of progress. Embrace the cold grind.",
    author: "Winter Arc Ethos",
    theme: "discipline"
  },
  {
    id: 8,
    quote: "Outwork your yesterday self. Nothing else matters.",
    author: "The Arena",
    theme: "focus"
  },
  {
    id: 9,
    quote: "Your future is built on the non-negotiables you honor today.",
    author: "Winter Arc Mindset",
    theme: "consistency"
  },
  {
    id: 10,
    quote: "Cold hands, warm heart, unbreakable focus.",
    author: "Northern Code",
    theme: "grit"
  },
  {
    id: 11,
    quote: "The winter arc is not a trend; it is an oath to your highest potential.",
    author: "Winter Arc Manifesto",
    theme: "discipline"
  },
  {
    id: 12,
    quote: "Consistency turns average talent into undeniable mastery.",
    author: "Habit Master",
    theme: "consistency"
  }
];

export function getRandomQuote(): MotivationQuote {
  const index = Math.floor(Math.random() * WINTER_ARC_QUOTES.length);
  return WINTER_ARC_QUOTES[index];
}

export function getQuoteForDay(dateStr: string): MotivationQuote {
  // Deterministic quote per day so it doesn't flicker on re-render
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % WINTER_ARC_QUOTES.length;
  return WINTER_ARC_QUOTES[index];
}
