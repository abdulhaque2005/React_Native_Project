import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PrimaryButton({ title, icon, onPress, disabled, style }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: disabled ? 0.6 : 1,
    };
  });

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.95);
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1);
    }
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[styles.buttonContainer, style, animatedStyle]}
    >
      <LinearGradient
        colors={['#60A5FA', '#2563EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.text}>{title}</Text>
        {icon && <Ionicons name={icon} size={22} color="#FFFFFF" style={styles.icon} />}
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 18,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 18,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  icon: {
    marginLeft: 8,
  }
});
