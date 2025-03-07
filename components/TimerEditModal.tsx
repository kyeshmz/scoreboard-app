import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface TimerEditModalProps {
  visible: boolean;
  onClose: () => void;
  timeRemaining: number;
  currentPeriod: number;
  isPeriodQuarters: boolean; 
  totalPeriods: number;
  onSave: (newTime: number, newPeriod: number) => void;
}

const TimerEditModal: React.FC<TimerEditModalProps> = ({
  visible,
  onClose,
  timeRemaining,
  currentPeriod,
  isPeriodQuarters,
  totalPeriods,
  onSave,
}) => {
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [period, setPeriod] = useState(currentPeriod);

  useEffect(() => {
    if (visible) {
      const mins = Math.floor(timeRemaining / 60);
      const secs = timeRemaining % 60;
      setMinutes(mins.toString());
      setSeconds(secs.toString().padStart(2, '0'));
      setPeriod(currentPeriod);
    }
  }, [visible, timeRemaining, currentPeriod]);

  const handleSave = () => {
    const mins = parseInt(minutes) || 0;
    const secs = parseInt(seconds) || 0;
    const newTime = (mins * 60) + secs;
    onSave(newTime, period);
    onClose();
  };

  const adjustPeriod = (amount: number) => {
    const newPeriod = period + amount;
    if (newPeriod >= 1 && newPeriod <= totalPeriods) {
      setPeriod(newPeriod);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-center items-center">
        <View className="bg-gray-800 p-5 rounded-2xl w-[85%] max-w-[400px]">
          <Text className="text-white text-2xl font-bold text-center mb-5">
            Edit Timer
          </Text>
          
          <View className="mb-5">
            <Text className="text-white text-lg mb-2.5 text-center">
              Time Remaining
            </Text>
            <View className="flex-row justify-center items-center">
              <TextInput
                className="bg-gray-700 text-white text-2xl font-bold p-2.5 rounded-lg w-[80px] text-center"
                value={minutes}
                onChangeText={(text) => {
                  // Only allow numeric input
                  const numericText = text.replace(/[^0-9]/g, '');
                  setMinutes(numericText);
                }}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="00"
                placeholderTextColor="#6b7280"
              />
              <Text className="text-white text-2xl font-bold mx-2.5">:</Text>
              <TextInput
                className="bg-gray-700 text-white text-2xl font-bold p-2.5 rounded-lg w-[80px] text-center"
                value={seconds}
                onChangeText={(text) => {
                  // Only allow numeric input
                  const numericText = text.replace(/[^0-9]/g, '');
                  // Limit to 59 seconds
                  const secs = parseInt(numericText) || 0;
                  setSeconds(secs > 59 ? '59' : numericText);
                }}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="00"
                placeholderTextColor="#6b7280"
              />
            </View>
          </View>
          
          <View className="mb-5">
            <Text className="text-white text-lg mb-2.5 text-center">
              Current {isPeriodQuarters ? "Quarter" : "Half"}
            </Text>
            <View className="flex-row justify-center items-center">
              <TouchableOpacity 
                className={`w-10 h-10 rounded-full justify-center items-center ${
                  period <= 1 ? 'bg-gray-700 opacity-50' : 'bg-gray-600'
                }`}
                onPress={() => adjustPeriod(-1)}
                disabled={period <= 1}
              >
                <Ionicons name="remove" size={20} color="white" />
              </TouchableOpacity>
              
              <Text className="text-white text-lg font-bold mx-5">
                {period} of {totalPeriods}
              </Text>
              
              <TouchableOpacity 
                className={`w-10 h-10 rounded-full justify-center items-center ${
                  period >= totalPeriods ? 'bg-gray-700 opacity-50' : 'bg-gray-600'
                }`} 
                onPress={() => adjustPeriod(1)}
                disabled={period >= totalPeriods}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View className="flex-row justify-between mt-2.5">
            <TouchableOpacity 
              className="bg-gray-600 py-3 px-6 rounded-lg flex-1 mr-2.5 items-center" 
              onPress={onClose}
            >
              <Text className="text-white text-base font-bold">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-blue-600 py-3 px-6 rounded-lg flex-1 ml-2.5 items-center" 
              onPress={handleSave}
            >
              <Text className="text-white text-base font-bold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TimerEditModal; 