export interface TeamScore {
  score: number
  name: string
  color: string
}

export interface GameSettings {
  increment: number
  periodDuration: number // in seconds
  isPeriodQuarters: boolean
  numberOfPeriods: number
}

export interface GameState {
  currentPeriod: number
  timeRemaining: number
  isTimerRunning: boolean
} 