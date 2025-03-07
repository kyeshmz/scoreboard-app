import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, Dimensions } from "react-native";
import type { GameSettings } from "./types";

interface SettingsProps {
  visible: boolean;
  gameSettings: GameSettings;
  onClose: () => void;
  onSave: (settings: GameSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({
  visible,
  gameSettings,
  onClose,
  onSave,
}) => {
  const [settings, setSettings] = useState<GameSettings>(gameSettings);

  useEffect(() => {
    setSettings(gameSettings);
  }, [gameSettings, visible]);

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Game Settings</Text>

          <View style={styles.settingSection}>
            <Text style={styles.settingTitle}>Score Increment</Text>
            <View style={styles.durationInputContainer}>
              <TouchableOpacity 
                style={styles.durationButton}
                onPress={() => {
                  if (settings.increment > 1) {
                    setSettings((prev) => ({
                      ...prev,
                      increment: prev.increment - 1,
                    }));
                  }
                }}
              >
                <Text style={styles.durationButtonText}>-</Text>
              </TouchableOpacity>
              
              <TextInput
                style={styles.durationInput}
                value={String(settings.increment)}
                onChangeText={(text) => {
                  // Only allow numeric input
                  const numericText = text.replace(/[^0-9]/g, '');
                  const value = parseInt(numericText) || 1;
                  setSettings((prev) => ({
                    ...prev,
                    increment: value,
                  }));
                }}
                keyboardType="number-pad"
              />
              
              <TouchableOpacity 
                style={styles.durationButton}
                onPress={() => {
                  setSettings((prev) => ({
                    ...prev,
                    increment: prev.increment + 1,
                  }));
                }}
              >
                <Text style={styles.durationButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingSection}>
            <Text style={styles.settingTitle}>Period Duration (minutes)</Text>
            <View style={styles.durationInputContainer}>
              <TouchableOpacity 
                style={styles.durationButton}
                onPress={() => {
                  const currentMinutes = settings.periodDuration / 60;
                  if (currentMinutes > 1) {
                    setSettings((prev) => ({
                      ...prev,
                      periodDuration: (currentMinutes - 1) * 60,
                    }));
                  }
                }}
              >
                <Text style={styles.durationButtonText}>-</Text>
              </TouchableOpacity>
              
              <TextInput
                style={styles.durationInput}
                value={String(settings.periodDuration / 60)}
                onChangeText={(text) => {
                  // Only allow numeric input
                  const numericText = text.replace(/[^0-9]/g, '');
                  const value = parseInt(numericText) || 1;
                  setSettings((prev) => ({
                    ...prev,
                    periodDuration: value * 60,
                  }));
                }}
                keyboardType="number-pad"
              />
              
              <TouchableOpacity 
                style={styles.durationButton}
                onPress={() => {
                  const currentMinutes = settings.periodDuration / 60;
                  setSettings((prev) => ({
                    ...prev,
                    periodDuration: (currentMinutes + 1) * 60,
                  }));
                }}
              >
                <Text style={styles.durationButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingSection}>
            <Text style={styles.settingTitle}>Period Type</Text>
            <View style={styles.periodTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.periodTypeButton,
                  !settings.isPeriodQuarters && styles.activePeriodTypeButton,
                ]}
                onPress={() =>
                  setSettings((prev) => ({
                    ...prev,
                    isPeriodQuarters: false,
                    numberOfPeriods: 2,
                  }))
                }
              >
                <Text
                  style={[
                    styles.periodTypeButtonText,
                    !settings.isPeriodQuarters && styles.activePeriodTypeButtonText,
                  ]}
                >
                  Halves
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.periodTypeButton,
                  settings.isPeriodQuarters && styles.activePeriodTypeButton,
                ]}
                onPress={() =>
                  setSettings((prev) => ({
                    ...prev,
                    isPeriodQuarters: true,
                    numberOfPeriods: 4,
                  }))
                }
              >
                <Text
                  style={[
                    styles.periodTypeButtonText,
                    settings.isPeriodQuarters && styles.activePeriodTypeButtonText,
                  ]}
                >
                  Quarters
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save and Return</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1f2937",
    padding: 24,
    borderRadius: 16,
    width: width * 0.85,
    maxWidth: 400,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  settingSection: {
    marginBottom: 24,
  },
  settingTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 8,
  },
  durationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationInput: {
    backgroundColor: "#374151",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    width: 80,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  durationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4b5563",
    alignItems: "center",
    justifyContent: "center",
  },
  durationButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  periodTypeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  periodTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#4b5563",
  },
  activePeriodTypeButton: {
    backgroundColor: "#3b82f6",
  },
  periodTypeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  activePeriodTypeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Settings; 