export type ColorId =
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'cyan'
  | 'lime'
  | 'navy'
  | 'teal'
  | 'magenta'
  | 'orange';

export type Prompt = {
  word: ColorId;
  ink: ColorId;
  options: ColorId[];
  correctIndex: number;
};

export type GameSession = {
  score: number;
  lives: number;
  timeLimitMs: number;
  currentPrompt: Prompt | null;
  /** Increments every time a new prompt is dealt (unique round id). */
  round: number;
  hasUsedContinue: boolean;
  startedAt: number;
};

export type Screen = 'home' | 'game' | 'gameOver';
