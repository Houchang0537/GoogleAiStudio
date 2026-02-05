
export enum AppScreen {
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
}

export interface GeneratorOptions {
  question: string;
  style: string;
  target: string;
}

export interface GeneratedResult {
  response: string;
  tip: string;
}
