import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing, interpolateColor } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export default function AnimatedInput({ 
  label, 
  value, 
  onChangeText, 
  icon,
  multiline = false, 
  placeholder,
  required = false
}) {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    if (value || isFocused) {
      focusAnim.value = withTiming(1, { duration: 200, easing: Easing.bezier(0.4, 0.0, 0.2, 1) });
    } else {
      focusAnim.value = withTiming(0, { duration: 200, easing: Easing.bezier(0.4, 0.0, 0.2, 1) });
    }
  }, [value, isFocused]);

  const labelStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: focusAnim.value * -12,
        },
        {
          scale: 1 - focusAnim.value * 0.15,
        }
      ],
      color: interpolateColor(
        focusAnim.value,
        [0, 1],
        ['#94A3B8', '#2563EB']
      ),
    };
  });

  const borderStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        focusAnim.value,
        [0, 1],
        ['#E2E8F0', '#38BDF8'] // Cyan highlight on focus
      ),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inputWrapper, borderStyle, multiline && styles.textAreaWrapper]}>
        {icon && <Ionicons name={icon} size={20} color={isFocused ? "#38BDF8" : "#94A3B8"} style={styles.icon} />}
        
        <View style={styles.content}>
          <Animated.Text style={[styles.label, labelStyle]}>
            {label} {required && <Text style={styles.required}>*</Text>}
          </Animated.Text>
          <TextInput
            style={[styles.input, multiline && styles.textArea]}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            multiline={multiline}
            placeholder={isFocused ? placeholder : ''}
            placeholderTextColor="#CBD5E1"
            textAlignVertical={multiline ? "top" : "center"}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 60,
  },
  textAreaWrapper: {
    height: 120,
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  icon: {
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    left: 0,
    fontSize: 15,
    fontWeight: '500',
  },
  required: {
    color: '#EF4444',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
    marginTop: 14, // Push text down to make room for floating label
    padding: 0,
  },
  textArea: {
    height: '100%',
    marginTop: 18,
  }
});
