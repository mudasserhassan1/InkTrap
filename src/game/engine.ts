import type {ColorId, GameSession, Prompt} from './types';

export const INITIAL_LIVES = 3;
export const INITIAL_TIME_MS = 2500;
export const MIN_TIME_MS = 900;
export const TIME_DECREMENT_MS = 50;
export const OPTION_COUNT = 4;

const BASE_COLORS: ColorId[] = ['red', 'blue', 'green', 'yellow'];
const TIER_1_COLORS: ColorId[] = ['cyan', 'lime'];
const TIER_2_COLORS: ColorId[] = ['navy', 'teal'];
const TIER_3_COLORS: ColorId[] = ['magenta', 'orange'];

const SCORE_TIER_1 = 10;
const SCORE_TIER_2 = 25;
const SCORE_TIER_3 = 50;

const NEAR_MISS_PAIRS: [ColorId, ColorId][] = [
  ['blue', 'cyan'],
  ['cyan', 'blue'],
  ['green', 'lime'],
  ['lime', 'green'],
  ['blue', 'navy'],
  ['navy', 'blue'],
  ['cyan', 'teal'],
  ['teal', 'cyan'],
];

const NEAR_MISS_BIAS = 0.6;

export function getColorPool(score: number): ColorId[] {
  const pool = [...BASE_COLORS];
  if (score >= SCORE_TIER_1) {
    pool.push(...TIER_1_COLORS);
  }
  if (score >= SCORE_TIER_2) {
    pool.push(...TIER_2_COLORS);
  }
  if (score >= SCORE_TIER_3) {
    pool.push(...TIER_3_COLORS);
  }
  return pool;
}

export function getTimeLimit(score: number): number {
  const reduced = INITIAL_TIME_MS - score * TIME_DECREMENT_MS;
  return Math.max(MIN_TIME_MS, reduced);
}

function pickRandom<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)]!;
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function pickWordAndInk(
  score: number,
  pool: ColorId[],
  random: () => number,
): {word: ColorId; ink: ColorId} {
  if (score >= SCORE_TIER_2 && random() < NEAR_MISS_BIAS) {
    const availablePairs = NEAR_MISS_PAIRS.filter(
      ([word, ink]) => pool.includes(word) && pool.includes(ink),
    );
    if (availablePairs.length > 0) {
      const [word, ink] = pickRandom(availablePairs, random);
      return {word, ink};
    }
  }

  let word: ColorId;
  let ink: ColorId;
  do {
    word = pickRandom(pool, random);
    ink = pickRandom(pool, random);
  } while (word === ink);

  return {word, ink};
}

export function generatePrompt(
  score: number,
  random: () => number = Math.random,
): Prompt {
  const pool = getColorPool(score);
  const {word, ink} = pickWordAndInk(score, pool, random);

  const distractors = pool.filter(color => color !== ink);
  const wrongOptions: ColorId[] = [];
  const available = [...distractors];

  while (wrongOptions.length < OPTION_COUNT - 1 && available.length > 0) {
    const index = Math.floor(random() * available.length);
    wrongOptions.push(available.splice(index, 1)[0]!);
  }

  while (wrongOptions.length < OPTION_COUNT - 1) {
    const fallback = pickRandom(
      distractors.filter(color => !wrongOptions.includes(color)),
      random,
    );
    wrongOptions.push(fallback);
  }

  const options = shuffle([ink, ...wrongOptions.slice(0, OPTION_COUNT - 1)], random);
  const correctIndex = options.indexOf(ink);

  return {word, ink, options, correctIndex};
}

export function createSession(): GameSession {
  return {
    score: 0,
    lives: INITIAL_LIVES,
    timeLimitMs: getTimeLimit(0),
    currentPrompt: generatePrompt(0),
    round: 0,
    hasUsedContinue: false,
    startedAt: Date.now(),
  };
}

export function checkAnswer(prompt: Prompt, selected: ColorId): boolean {
  return selected === prompt.ink;
}

export function applyCorrect(session: GameSession): GameSession {
  const score = session.score + 1;
  return {
    ...session,
    score,
    timeLimitMs: getTimeLimit(score),
    round: session.round + 1,
    currentPrompt: generatePrompt(score),
  };
}

export function applyWrong(session: GameSession): GameSession {
  const lives = session.lives - 1;
  if (lives <= 0) {
    return {...session, lives: 0};
  }
  return {
    ...session,
    lives,
    round: session.round + 1,
    currentPrompt: generatePrompt(session.score),
  };
}

export function isGameOver(session: GameSession): boolean {
  return session.lives <= 0;
}

export function applyContinue(session: GameSession): GameSession {
  return {
    ...session,
    lives: 1,
    hasUsedContinue: true,
    round: session.round + 1,
    currentPrompt: generatePrompt(session.score),
  };
}
