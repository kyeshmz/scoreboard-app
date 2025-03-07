import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameSettings, TeamScore } from '../components/types';

// Storage keys
const STORAGE_KEYS = {
  LEFT_TEAM: 'basketball_app_left_team',
  RIGHT_TEAM: 'basketball_app_right_team',
  GAME_SETTINGS: 'basketball_app_game_settings',
  GAME_STATE: 'basketball_app_game_state',
};

// Save team data
export const saveTeam = async (team: 'left' | 'right', data: TeamScore): Promise<void> => {
  try {
    const key = team === 'left' ? STORAGE_KEYS.LEFT_TEAM : STORAGE_KEYS.RIGHT_TEAM;
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${team} team:`, error);
  }
};

// Load team data
export const loadTeam = async (team: 'left' | 'right'): Promise<TeamScore | null> => {
  try {
    const key = team === 'left' ? STORAGE_KEYS.LEFT_TEAM : STORAGE_KEYS.RIGHT_TEAM;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error loading ${team} team:`, error);
    return null;
  }
};

// Save game settings
export const saveGameSettings = async (settings: GameSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.GAME_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving game settings:', error);
  }
};

// Load game settings
export const loadGameSettings = async (): Promise<GameSettings | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.GAME_SETTINGS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading game settings:', error);
    return null;
  }
};

// Save game state
export const saveGameState = async (state: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

// Load game state
export const loadGameState = async (): Promise<any | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
};

// Clear all stored data (for reset)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.LEFT_TEAM,
      STORAGE_KEYS.RIGHT_TEAM,
      STORAGE_KEYS.GAME_SETTINGS,
      STORAGE_KEYS.GAME_STATE,
    ]);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

// Save all data at once (useful for background state)
export const saveAllData = async (
  leftTeam: TeamScore, 
  rightTeam: TeamScore, 
  settings: GameSettings, 
  state: any
): Promise<void> => {
  try {
    const promises = [
      AsyncStorage.setItem(STORAGE_KEYS.LEFT_TEAM, JSON.stringify(leftTeam)),
      AsyncStorage.setItem(STORAGE_KEYS.RIGHT_TEAM, JSON.stringify(rightTeam)), 
      AsyncStorage.setItem(STORAGE_KEYS.GAME_SETTINGS, JSON.stringify(settings)),
      AsyncStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state)),
    ];
    
    await Promise.all(promises);
    console.log('All data saved successfully');
  } catch (error) {
    console.error('Error saving all data:', error);
  }
}; 