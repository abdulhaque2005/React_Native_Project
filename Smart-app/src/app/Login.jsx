import React, { useCallback } from 'react';
import { 
  View, Text, Pressable, TouchableOpacity, StyleSheet, Platform, 
  KeyboardAvoidingView, ScrollView, Alert, StatusBar 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from '../utils/useWarmUpBrowser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleGoogleLogin = useCallback(async () => {
    try {
      const redirectUrl = Platform.OS === 'web' 
        ? `${window.location.origin}/` 
        : Linking.createURL('/(tabs)', { scheme: 'myapp' });

      const { createdSessionId, setActive } = await startOAuthFlow({ redirectUrl });
      
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (err) {
      console.error("OAuth error", err);
      const errMsg = err?.errors?.[0]?.message || err?.message || 'Could not complete Google authentication.';
      if (Platform.OS === 'web') {
        window.alert(`Sign In Failed: ${errMsg}`);
      } else {
        Alert.alert('Sign In Failed', errMsg);
      }
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <LinearGradient
        colors={['#0F172A', '#1E293B']}
        style={[styles.topSection, { paddingTop: insets.top + 40 }]}
      >
        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <View style={styles.logoContainer}>
            <LinearGradient colors={['#3B82F6', '#6366F1']} style={styles.logoGradient}>
              <Ionicons name="shield-checkmark" size={32} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <Text style={styles.brandName}>Smart Field Survey</Text>
          <Text style={styles.brandTagline}>Professional inspection management</Text>
        </Animated.View>
      </LinearGradient>

      <KeyboardAvoidingView 
        style={styles.formSection}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.welcomeTitle}>Welcome back to smart app</Text>
              <Text style={styles.welcomeSubtitle}>Sign in to access your dashboard</Text>
            </View>

            <TouchableOpacity 
              style={styles.googleButton}
              activeOpacity={0.7}
              onPress={handleGoogleLogin}
            >
              <Ionicons name="logo-google" size={24} color="#EA4335" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            
            <Text style={styles.footerText}>By continuing, you agree to our Terms of Service & Privacy Policy.</Text>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9', // light gray background instead of pure white
  },
  topSection: {
    paddingHorizontal: 24,
    paddingBottom: 60,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    zIndex: 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoGradient: {
    width: 76,
    height: 76,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
  formSection: {
    flex: 1,
    marginTop: -40, // overlap with top section
    zIndex: 3,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 10,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    marginTop: 10,
  },
  googleButtonPressed: {
    opacity: 0.7,
    backgroundColor: '#F8FAFC',
    transform: [{ scale: 0.98 }],
  },
  googleIcon: {
    marginRight: 14,
  },
  googleButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  footerText: {
    marginTop: 28,
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  }
});
