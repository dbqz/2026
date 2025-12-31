export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export enum AppState {
  COUNTDOWN = 'COUNTDOWN',
  CELEBRATION = 'CELEBRATION',
}

export interface Coordinates {
  x: number;
  y: number;
}