import React from 'react';
import Scoreboard from './components/Scoreboard';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <Scoreboard />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
