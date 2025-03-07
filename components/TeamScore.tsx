import React from "react";
import { TouchableOpacity, Text, View, GestureResponderEvent } from "react-native";

interface TeamScoreProps {
  score: number;
  teamName: string;
  color: string;
  increment: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onLongPress: () => void;
}

const TeamScore: React.FC<TeamScoreProps> = ({
  score,
  teamName,
  color,
  increment,
  onIncrement,
  onDecrement,
  onLongPress,
}) => {
  // Handle two-finger tap for decrement
  const handleTouch = (event: GestureResponderEvent) => {
    if (event.nativeEvent.touches && event.nativeEvent.touches.length === 2) {
      onDecrement();
    }
  };

  // Create a separate style object for the dynamic background color
  const backgroundStyle = {
    backgroundColor: color,
  };

  return (
    <View 
      className="flex-1 items-center justify-center p-2.5"
      onTouchStart={handleTouch}
      // Apply the background color as a separate style prop to avoid Reanimated warnings
      style={backgroundStyle}
    >
      <TouchableOpacity 
        className="flex-1 w-full items-center justify-center"
        onPress={onIncrement}
        onLongPress={onLongPress}
        delayLongPress={800}
        activeOpacity={0.8}
      >
        <Text className="text-white text-2xl font-bold mb-4">
          {teamName}
        </Text>
        <Text className="text-white text-[96px] font-bold">
          {score}
        </Text>
      </TouchableOpacity>
      
      <Text className="text-white text-sm">
        Two-finger tap to subtract points
      </Text>
      <Text className="text-white text-sm">
        Long press to change color
      </Text>
    </View>
  );
};

export default TeamScore; 