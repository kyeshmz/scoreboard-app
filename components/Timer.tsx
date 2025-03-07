import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

interface TimerProps {
  isPeriodQuarters: boolean;
  currentPeriod: number;
  timeRemaining: number;
  isTimeOver: boolean;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onLongPress: () => void;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

const Timer: React.FC<TimerProps> = ({ 
  isPeriodQuarters, 
  currentPeriod, 
  timeRemaining,
  isTimeOver,
  isTimerRunning,
  onToggleTimer,
  onLongPress
}) => {
  return (
    <TouchableOpacity 
      className={`
        bg-gray-800/85 py-2 px-4 rounded-xl items-center justify-center shadow shadow-black
        min-w-[120px] border border-white/20
        ${isTimeOver ? 'bg-red-800/90 border-white/40' : ''}
      `}
      onPress={onToggleTimer}
      onLongPress={onLongPress}
      delayLongPress={500}
      activeOpacity={0.7}
    >
      <Text className={`text-white text-[28px] font-bold text-center ${isTimeOver ? 'text-red-200' : ''}`}>
        {formatTime(timeRemaining)}
      </Text>
      <View className="flex-row justify-center items-center">
        <Text className="text-white text-sm font-bold mr-2">
          {isPeriodQuarters ? "Q" : "H"}{currentPeriod}
        </Text>
        <Text className="text-gray-300 text-sm mt-0.5">
          {isTimerRunning ? "●" : isTimeOver ? "■" : "▶"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Timer;
export { formatTime }; 