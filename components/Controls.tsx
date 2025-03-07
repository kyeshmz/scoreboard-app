import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

interface ControlsProps {
  isTimerRunning: boolean;
  onSwitchSides: () => void;
  onToggleTimer: () => void;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  onSwitchSides,
  onReset,
}) => {
  return (
    <View className="py-1.5 px-2.5 bg-gray-800">
      <View className="flex-row justify-around mb-1">
        <TouchableOpacity 
          className="bg-gray-600 py-2 px-3 rounded-lg items-center justify-center min-w-[60px]" 
          onPress={onSwitchSides}
        >
          <MaterialIcons name="swap-horiz" size={20} color="white" />
          <Text className="text-white font-bold text-[10px] mt-0.5">Switch</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-gray-600 py-2 px-3 rounded-lg items-center justify-center min-w-[60px]" 
          onPress={onReset}
        >
          <MaterialIcons name="refresh" size={20} color="white" />
          <Text className="text-white font-bold text-[10px] mt-0.5">Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Controls; 