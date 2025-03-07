import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, Dimensions } from "react-native";

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>How to Use</Text>
          
          <ScrollView style={styles.helpScrollView}>
            <View style={styles.helpSection}>
              <Text style={styles.helpSectionTitle}>Scoreboard</Text>
              <Text style={styles.helpText}>• <Text style={styles.helpTextBold}>Tap</Text> anywhere on a team's colored area to add points</Text>
              <Text style={styles.helpText}>• <Text style={styles.helpTextBold}>Two-finger tap</Text> anywhere on a team's colored area to subtract points</Text>
              <Text style={styles.helpText}>• <Text style={styles.helpTextBold}>Long press</Text> on a team area to change its color</Text>
            </View>
            
            <View style={styles.helpSection}>
              <Text style={styles.helpSectionTitle}>Timer</Text>
              <Text style={styles.helpText}>• The timer is displayed at the <Text style={styles.helpTextBold}>top of the screen</Text></Text>
              <Text style={styles.helpText}>• <Text style={styles.helpTextBold}>Tap</Text> directly on the timer to start/pause it</Text>
              <Text style={styles.helpText}>• <Text style={styles.helpTextBold}>Long press</Text> on the timer to manually edit time and period</Text>
              <Text style={styles.helpText}>• Timer turns <Text style={styles.helpTextBold}>red</Text> when time is over</Text>
            </View>
            
            <View style={styles.helpSection}>
              <Text style={styles.helpSectionTitle}>Controls</Text>
              <Text style={styles.helpText}>• <Text style={styles.helpTextBold}>Settings icon</Text> (top left) - Change game settings</Text>
              <Text style={styles.helpText}>• <Text style={styles.helpTextBold}>Help icon</Text> (top right) - Show this help screen</Text>
              <Text style={styles.helpText}>• <Text style={styles.helpTextBold}>Switch</Text> - Swap team sides and scores</Text>
              <Text style={styles.helpText}>• <Text style={styles.helpTextBold}>Reset</Text> - Reset scores and timer</Text>
            </View>
            
            <View style={styles.helpSection}>
              <Text style={styles.helpSectionTitle}>Settings</Text>
              <Text style={styles.helpText}>• <Text style={styles.helpTextBold}>Score Increment</Text>: Set points added per tap</Text>
              <Text style={styles.helpText}>• <Text style={styles.helpTextBold}>Period Duration</Text>: Set game time per period</Text>
              <Text style={styles.helpText}>• <Text style={styles.helpTextBold}>Period Type</Text>: Choose between halves or quarters</Text>
              <Text style={styles.helpText}>• Use the <Text style={styles.helpTextBold}>+/- buttons</Text> to adjust numeric values</Text>
            </View>
            
            <View style={styles.helpSection}>
              <Text style={styles.helpSectionTitle}>Orientation Support</Text>
              <Text style={styles.helpText}>• The app works in both <Text style={styles.helpTextBold}>portrait</Text> and <Text style={styles.helpTextBold}>landscape</Text> orientations</Text>
            </View>
          </ScrollView>
          
          <TouchableOpacity style={styles.saveButton} onPress={onClose}>
            <Text style={styles.saveButtonText}>Close</Text>
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
  helpScrollView: {
    maxHeight: height * 0.5,
  },
  helpSection: {
    marginBottom: 20,
  },
  helpSectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  helpText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },
  helpTextBold: {
    fontWeight: "bold",
    color: "#93c5fd",
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

export default HelpModal; 