import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, Dimensions } from "react-native";

interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectColor: (color: string) => void;
  currentColor: string;
}

// Basketball-relevant color palette
const colorOptions = [
  // Reds
  { name: "Red", value: "#dc2626" },
  { name: "Bright Red", value: "#ef4444" },
  { name: "Dark Red", value: "#991b1b" },
  { name: "Crimson", value: "#b91c1c" },
  
  // Blues
  { name: "Blue", value: "#2563eb" },
  { name: "Royal Blue", value: "#1d4ed8" },
  { name: "Light Blue", value: "#3b82f6" },
  { name: "Navy", value: "#1e40af" },
  
  // Greens
  { name: "Green", value: "#16a34a" },
  { name: "Forest Green", value: "#166534" },
  { name: "Emerald", value: "#059669" },
  
  // Yellows/Golds
  { name: "Gold", value: "#eab308" },
  { name: "Yellow", value: "#facc15" },
  { name: "Amber", value: "#d97706" },
  
  // Purples
  { name: "Purple", value: "#7c3aed" },
  { name: "Violet", value: "#8b5cf6" },
  
  // Orange/Browns
  { name: "Orange", value: "#ea580c" },
  { name: "Dark Orange", value: "#c2410c" },
  { name: "Brown", value: "#78350f" },
  
  // Black/Gray
  { name: "Black", value: "#171717" },
  { name: "Dark Gray", value: "#404040" },
];

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  visible,
  onClose,
  onSelectColor,
  currentColor,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-center items-center">
        <View className="bg-gray-800 p-5 rounded-2xl w-[85%] max-w-[400px] max-h-[80%]">
          <Text className="text-white text-2xl font-bold text-center mb-5">
            Select Team Color
          </Text>
          
          <ScrollView className="max-h-[300px]">
            <View className="flex-row flex-wrap justify-center">
              {colorOptions.map((color, index) => {
                // Create a separate style object for the dynamic background color
                const buttonStyle = {
                  backgroundColor: color.value,
                };
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={buttonStyle}
                    className={`w-[50px] h-[50px] m-2 rounded-full justify-center items-center border-2 ${
                      currentColor === color.value ? 'border-white border-[3px]' : 'border-transparent'
                    }`}
                    onPress={() => onSelectColor(color.value)}
                  >
                    {currentColor === color.value && (
                      <Text className="text-white text-xl font-bold">✓</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          
          <TouchableOpacity 
            className="bg-blue-600 py-3 rounded-lg items-center mt-5"
            onPress={onClose}
          >
            <Text className="text-white text-base font-bold">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ColorPickerModal; 