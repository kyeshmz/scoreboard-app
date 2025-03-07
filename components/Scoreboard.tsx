import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Dimensions, TouchableOpacity, AppState, AppStateStatus, Text } from "react-native";
import * as KeepAwake from 'expo-keep-awake';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Import components
import Timer from "./Timer";
import TeamScore from "./TeamScore";
import Controls from "./Controls";
import Settings from "./Settings";
import HelpModal from "./HelpModal";
import TimerEditModal from "./TimerEditModal";
import ColorPickerModal from "./ColorPickerModal";

// Import types and storage utilities
import type { TeamScore as TeamScoreType, GameSettings, GameState } from "./types";
import {
  loadTeam,
  saveTeam,
  loadGameSettings,
  saveGameSettings,
  loadGameState,
  saveGameState,
  clearAllData,
  saveAllData
} from "../utils/storage";

export default function Scoreboard() {
  const [leftTeam, setLeftTeam] = useState<TeamScoreType>({
    score: 0,
    name: "HOME",
    color: "#dc2626", // NativeWind red-600
  });
  const [rightTeam, setRightTeam] = useState<TeamScoreType>({
    score: 0,
    name: "AWAY",
    color: "#2563eb", // NativeWind blue-600
  });
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    increment: 1,
    periodDuration: 600, // 10 minutes in seconds
    isPeriodQuarters: false,
    numberOfPeriods: 2,
  });
  const [gameState, setGameState] = useState<GameState>({
    currentPeriod: 1,
    timeRemaining: gameSettings.periodDuration,
    isTimerRunning: false,
  });
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [isTimeOver, setIsTimeOver] = useState<boolean>(false);

  // Add orientation state
  const [isLandscape, setIsLandscape] = useState(
    Dimensions.get('window').width > Dimensions.get('window').height
  );

  const [showTimerEdit, setShowTimerEdit] = useState<boolean>(false);
  const [showLeftColorPicker, setShowLeftColorPicker] = useState<boolean>(false);
  const [showRightColorPicker, setShowRightColorPicker] = useState<boolean>(false);

  // Add a ref to track if data is already loaded
  const dataLoadedRef = useRef(false);
  // Add a ref to AppState
  const appStateRef = useRef(AppState.currentState);

  // Load saved data on startup
  useEffect(() => {
    if (dataLoadedRef.current) return;
    
    const loadSavedData = async () => {
      try {
        console.log('Loading saved data...');
        // Load teams data
        const savedLeftTeam = await loadTeam('left');
        const savedRightTeam = await loadTeam('right');
        if (savedLeftTeam) setLeftTeam(savedLeftTeam);
        if (savedRightTeam) setRightTeam(savedRightTeam);

        // Load game settings
        const savedSettings = await loadGameSettings();
        if (savedSettings) setGameSettings(savedSettings);

        // Load game state
        const savedState = await loadGameState();
        if (savedState) {
          setGameState(savedState);
          if (savedState.timeRemaining === 0) setIsTimeOver(true);
        }
        
        dataLoadedRef.current = true;
        console.log('Data loaded successfully');
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };

    loadSavedData();
  }, []);

  // Add AppState listener to save data when app is backgrounded or closed
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/active/) && 
        (nextAppState === 'background' || nextAppState === 'inactive')
      ) {
        // App is going to background or inactive, save all data immediately
        console.log('App going to background, saving all data...');
        // Use the more efficient saveAllData function
        await saveAllData(leftTeam, rightTeam, gameSettings, gameState);
        console.log('All data saved before background');
      }
      appStateRef.current = nextAppState;
    };

    // Subscribe to AppState change events
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [leftTeam, rightTeam, gameSettings, gameState]);

  // Individual save effects - these will handle regular saves during use
  // Save teams data whenever they change
  useEffect(() => {
    saveTeam('left', leftTeam);
  }, [leftTeam]);

  useEffect(() => {
    saveTeam('right', rightTeam);
  }, [rightTeam]);

  // Save game settings whenever they change
  useEffect(() => {
    saveGameSettings(gameSettings);
  }, [gameSettings]);

  // Save game state whenever it changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Listen for orientation changes
  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setIsLandscape(width > height);
    };

    const subscription = Dimensions.addEventListener('change', updateOrientation);

    return () => {
      subscription.remove();
    };
  }, []);

  // Timer effect - update time remaining
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameState.isTimerRunning && gameState.timeRemaining > 0) {
      interval = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
        
        // Save time remaining more frequently when timer is running
        // This is throttled to only save every 5 seconds to avoid performance issues
        if (gameState.timeRemaining % 5 === 0) {
          saveGameState({
            ...gameState,
            timeRemaining: gameState.timeRemaining
          });
        }
      }, 1000);
      setIsTimeOver(false);
    } else if (gameState.timeRemaining === 0) {
      setIsTimeOver(true);
      handlePeriodEnd();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.isTimerRunning, gameState.timeRemaining]);

  useEffect(() => {
    // Keep the screen awake during gameplay
    KeepAwake.activateKeepAwake();
    
    // Don't show help modal on first run
    setShowHelp(false);
    
    return () => {
      KeepAwake.deactivateKeepAwake();
    };
  }, []);

  const handlePeriodEnd = useCallback(() => {
    if (gameState.currentPeriod < gameSettings.numberOfPeriods) {
      setGameState((prev) => ({
        ...prev,
        currentPeriod: prev.currentPeriod + 1,
        timeRemaining: gameSettings.periodDuration,
        isTimerRunning: false,
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        isTimerRunning: false,
      }));
    }
  }, [gameState.currentPeriod, gameSettings.numberOfPeriods, gameSettings.periodDuration]);

  const incrementScore = (team: "left" | "right") => {
    if (team === "left") {
      setLeftTeam((prev) => ({ ...prev, score: prev.score + gameSettings.increment }));
    } else {
      setRightTeam((prev) => ({ ...prev, score: prev.score + gameSettings.increment }));
    }
  };

  const decrementScore = (team: "left" | "right") => {
    if (team === "left") {
      setLeftTeam((prev) => ({
        ...prev,
        score: Math.max(0, prev.score - gameSettings.increment),
      }));
    } else {
      setRightTeam((prev) => ({
        ...prev,
        score: Math.max(0, prev.score - gameSettings.increment),
      }));
    }
  };

  const updateIncrement = (team: "left" | "right", value: number) => {
    setGameSettings(prev => ({
      ...prev,
      increment: value
    }));
  };

  const switchSides = () => {
    setLeftTeam((prev) => ({ ...prev, color: rightTeam.color }));
    setRightTeam((prev) => ({ ...prev, color: leftTeam.color }));
    const tempScore = leftTeam.score;
    setLeftTeam((prev) => ({ ...prev, score: rightTeam.score }));
    setRightTeam((prev) => ({ ...prev, score: tempScore }));
  };

  const toggleTimer = () => {
    setGameState((prev) => ({ ...prev, isTimerRunning: !prev.isTimerRunning }));
  };

  const resetGame = async () => {
    setLeftTeam((prev) => ({ ...prev, score: 0 }));
    setRightTeam((prev) => ({ ...prev, score: 0 }));
    setGameState({
      currentPeriod: 1,
      timeRemaining: gameSettings.periodDuration,
      isTimerRunning: false,
    });
    setIsTimeOver(false);
    
    // Optionally clear all stored data on reset
    // await clearAllData(); 
  };

  const saveSettings = (newSettings: GameSettings) => {
    setGameSettings(newSettings);
    setGameState((prev) => ({
      ...prev,
      timeRemaining: newSettings.periodDuration,
      currentPeriod: 1,
      isTimerRunning: false,
    }));
    setIsTimeOver(false);
  };

  const editTimerSettings = (newTime: number, newPeriod: number) => {
    setGameState(prev => ({
      ...prev,
      timeRemaining: newTime,
      currentPeriod: newPeriod,
      isTimerRunning: false,
    }));
    setIsTimeOver(false);
  };

  const changeTeamColor = (team: "left" | "right", newColor: string) => {
    if (team === "left") {
      setLeftTeam(prev => ({ ...prev, color: newColor }));
    } else {
      setRightTeam(prev => ({ ...prev, color: newColor }));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center justify-between px-2.5 pt-1 pb-2.5 w-full z-30">
        {/* Settings Button in Top Left */}
        <TouchableOpacity 
          className="p-2 rounded-full bg-black/50" 
          onPress={() => setShowSettings(true)}
        >
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
        
        {/* App Title */}
        <Text className="text-white font-bold text-lg">Scoreboard</Text>
        
        {/* Timer moved to top center */}
        <View className="flex-1 items-center px-1">
          <Timer
            isPeriodQuarters={gameSettings.isPeriodQuarters}
            currentPeriod={gameState.currentPeriod}
            timeRemaining={gameState.timeRemaining}
            isTimeOver={isTimeOver}
            isTimerRunning={gameState.isTimerRunning}
            onToggleTimer={toggleTimer}
            onLongPress={() => setShowTimerEdit(true)}
          />
        </View>
        
        {/* Help Button in Top Right */}
        <TouchableOpacity 
          className="p-2 rounded-full bg-black/50" 
          onPress={() => setShowHelp(true)}
        >
          <Ionicons name="help-circle-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Main Scoreboard */}
      <View className={`flex-1 flex-row ${isLandscape ? 'pt-2.5' : ''}`}>
        {/* Left Team */}
        <View className="flex-1">
          <TeamScore
            score={leftTeam.score}
            teamName={leftTeam.name}
            color={leftTeam.color}
            increment={gameSettings.increment}
            onIncrement={() => incrementScore("left")}
            onDecrement={() => decrementScore("left")}
            onLongPress={() => setShowLeftColorPicker(true)}
          />
        </View>

        {/* Right Team */}
        <View className="flex-1">
          <TeamScore
            score={rightTeam.score}
            teamName={rightTeam.name}
            color={rightTeam.color}
            increment={gameSettings.increment}
            onIncrement={() => incrementScore("right")}
            onDecrement={() => decrementScore("right")}
            onLongPress={() => setShowRightColorPicker(true)}
          />
        </View>
      </View>

      {/* Controls */}
      <Controls
        isTimerRunning={gameState.isTimerRunning}
        onSwitchSides={switchSides}
        onToggleTimer={toggleTimer}
        onReset={resetGame}
      />

      {/* Settings */}
      <Settings
        visible={showSettings}
        gameSettings={gameSettings}
        onClose={() => setShowSettings(false)}
        onSave={saveSettings}
      />
      
      {/* Help Modal */}
      <HelpModal
        visible={showHelp}
        onClose={() => setShowHelp(false)}
      />
      
      {/* Timer Edit Modal */}
      <TimerEditModal
        visible={showTimerEdit}
        onClose={() => setShowTimerEdit(false)}
        timeRemaining={gameState.timeRemaining}
        currentPeriod={gameState.currentPeriod}
        isPeriodQuarters={gameSettings.isPeriodQuarters}
        totalPeriods={gameSettings.numberOfPeriods}
        onSave={editTimerSettings}
      />
      
      {/* Color Picker Modals */}
      <ColorPickerModal
        visible={showLeftColorPicker}
        onClose={() => setShowLeftColorPicker(false)}
        currentColor={leftTeam.color}
        onSelectColor={(color) => changeTeamColor("left", color)}
      />
      
      <ColorPickerModal
        visible={showRightColorPicker}
        onClose={() => setShowRightColorPicker(false)}
        currentColor={rightTeam.color}
        onSelectColor={(color) => changeTeamColor("right", color)}
      />
    </SafeAreaView>
  );
} 