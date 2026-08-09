import {
  applyContinue,
  applyCorrect,
  applyWrong,
  createSession,
  generatePrompt,
  getColorPool,
  getTimeLimit,
  INITIAL_TIME_MS,
  isGameOver,
  MIN_TIME_MS,
  OPTION_COUNT,
  TIME_DECREMENT_MS,
} from '../src/game/engine';

describe('getTimeLimit', () => {
  it('starts at 2500ms', () => {
    expect(getTimeLimit(0)).toBe(INITIAL_TIME_MS);
  });

  it('decreases by 50ms per correct answer', () => {
    expect(getTimeLimit(1)).toBe(INITIAL_TIME_MS - TIME_DECREMENT_MS);
    expect(getTimeLimit(10)).toBe(INITIAL_TIME_MS - 10 * TIME_DECREMENT_MS);
  });

  it('floors at 900ms', () => {
    expect(getTimeLimit(100)).toBe(MIN_TIME_MS);
  });
});

describe('getColorPool', () => {
  it('starts with 4 base colors', () => {
    expect(getColorPool(0)).toEqual(['red', 'blue', 'green', 'yellow']);
  });

  it('adds near-miss colors at score 10', () => {
    const pool = getColorPool(10);
    expect(pool).toContain('cyan');
    expect(pool).toContain('lime');
  });

  it('adds tier 2 colors at score 25', () => {
    const pool = getColorPool(25);
    expect(pool).toContain('navy');
    expect(pool).toContain('teal');
  });

  it('adds tier 3 colors at score 50', () => {
    const pool = getColorPool(50);
    expect(pool).toContain('magenta');
    expect(pool).toContain('orange');
  });
});

describe('generatePrompt', () => {
  const sequence = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
  let index = 0;
  const random = () => {
    const value = sequence[index % sequence.length]!;
    index += 1;
    return value;
  };

  beforeEach(() => {
    index = 0;
  });

  it('word color differs from ink color', () => {
    for (let i = 0; i < 20; i += 1) {
      const prompt = generatePrompt(0, Math.random);
      expect(prompt.word).not.toBe(prompt.ink);
    }
  });

  it('returns 4 shuffled options with correct ink present', () => {
    const prompt = generatePrompt(0, random);
    expect(prompt.options).toHaveLength(OPTION_COUNT);
    expect(prompt.options[prompt.correctIndex]).toBe(prompt.ink);
    expect(new Set(prompt.options).size).toBe(OPTION_COUNT);
  });

  it('biases toward near-miss pairs at score 25+', () => {
    const nearMissPairs = new Set([
      'blue-cyan',
      'cyan-blue',
      'green-lime',
      'lime-green',
      'blue-navy',
      'navy-blue',
      'cyan-teal',
      'teal-cyan',
    ]);

    let nearMissCount = 0;
    const trials = 200;
    for (let i = 0; i < trials; i += 1) {
      const prompt = generatePrompt(30, Math.random);
      const key = `${prompt.word}-${prompt.ink}`;
      if (nearMissPairs.has(key)) {
        nearMissCount += 1;
      }
    }

    expect(nearMissCount).toBeGreaterThan(trials * 0.3);
  });
});

describe('session flow', () => {
  it('creates session with startedAt timestamp', () => {
    const before = Date.now();
    const session = createSession();
    const after = Date.now();
    expect(session.startedAt).toBeGreaterThanOrEqual(before);
    expect(session.startedAt).toBeLessThanOrEqual(after);
  });

  it('increments score and speeds up timer on correct answer', () => {
    const session = createSession();
    const next = applyCorrect(session);
    expect(next.score).toBe(1);
    expect(next.timeLimitMs).toBe(getTimeLimit(1));
    expect(next.currentPrompt).not.toBeNull();
  });

  it('loses a life on wrong answer', () => {
    const session = createSession();
    const next = applyWrong(session);
    expect(next.lives).toBe(2);
    expect(next.round).toBe(session.round + 1);
  });

  it('detects game over at 0 lives', () => {
    let session = createSession();
    session = applyWrong(session);
    session = applyWrong(session);
    session = applyWrong(session);
    expect(isGameOver(session)).toBe(true);
  });

  it('continue grants 1 life and marks flag', () => {
    let session = createSession();
    session = applyWrong(session);
    session = applyWrong(session);
    session = applyWrong(session);
    const continued = applyContinue(session);
    expect(continued.lives).toBe(1);
    expect(continued.hasUsedContinue).toBe(true);
    expect(continued.score).toBe(session.score);
  });
});
