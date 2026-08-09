import type {ColorId} from '../game/types';

export const COLOR_DEFINITIONS: Record<
  ColorId,
  {label: string; hex: string}
> = {
  red: {label: 'RED', hex: '#E53935'},
  blue: {label: 'BLUE', hex: '#1E88E5'},
  green: {label: 'GREEN', hex: '#43A047'},
  yellow: {label: 'YELLOW', hex: '#FDD835'},
  cyan: {label: 'CYAN', hex: '#00ACC1'},
  lime: {label: 'LIME', hex: '#C0CA33'},
  navy: {label: 'NAVY', hex: '#1A237E'},
  teal: {label: 'TEAL', hex: '#00897B'},
  magenta: {label: 'MAGENTA', hex: '#D81B60'},
  orange: {label: 'ORANGE', hex: '#FB8C00'},
};

export const UI = {
  background: '#0F0F14',
  surface: '#1A1A24',
  text: '#FFFFFF',
  textMuted: '#9E9EAE',
  accent: '#7C4DFF',
  danger: '#FF5252',
  success: '#69F0AE',
  timerTrack: '#2A2A38',
  timerFill: '#7C4DFF',
};
