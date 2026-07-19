import "react-native-gesture-handler";
import "../../global.css";
import * as React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, ActivityIndicator } from 'react-native';
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { requestNotificationPermissions } from "../utils/notifications";
import { ClerkProvider, ClerkLoaded, useAuth, useUser } from '@clerk/clerk-expo';
import { tokenCache } from '../utils/tokenCache';
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) return user.firstName[0].toUpperCase();
    if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (user?.fullName) return user.fullName;
    if (user?.firstName) return user.firstName;
    if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress.split('@')[0];
    }
    return 'User';
  };

  const handleLogout = async () => {
    try {
      if (Platform.OS === 'web') {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (!confirmLogout) return;
      }
      await signOut();
    } catch (e) {
      console.warn("SignOut error:", e);
    } finally {
      router.replace('/Login');
    }
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: '#0F172A' }}>
      {/* @ts-ignore */}
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: insets.top }}>
        <View style={[styles.drawerHeader, { paddingTop: insets.top + 20 }]}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <Text style={styles.userName}>{getDisplayName()}</Text>
          <Text style={styles.userRole}>{user?.emailAddresses?.[0]?.emailAddress || 'Field Inspector'}</Text>
        </View>

        <View style={styles.drawerItemsContainer}>
          <DrawerItemList {...props} />
        </View>

      </DrawerContentScrollView>

      <View style={[styles.drawerFooter, { paddingBottom: insets.bottom + 20 }]}>
        <Pressable 
          style={({ pressed }) => [styles.logoutButtonContainer, pressed && styles.logoutButtonPressed]}
          onPress={handleLogout}
        >
          <LinearGradient
            colors={['#EF4444', '#B91C1C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoutGradient}
          >
            <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </LinearGradient>
        </Pressable>
        <Text style={styles.versionText}>App Version v1.0.0</Text>
      </View>
    </View>
  );
}

function DrawerLayout() {
  React.useEffect(() => {
    requestNotificationPermissions();
  }, []);

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerLeft: () => (
          <Pressable 
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            style={({ pressed }) => [styles.headerMenuButton, pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }]}
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          >
            <Ionicons name="menu-outline" size={28} color="#0F172A" />
          </Pressable>
        ),
        headerStyle: { backgroundColor: '#FFFFFF', shadowColor: '#0F172A', elevation: 4 },
        headerTintColor: '#0F172A',
        headerTitleStyle: { fontWeight: '900', fontSize: 18, letterSpacing: -0.5 },
        headerTitleAlign: 'center',
        drawerActiveTintColor: '#2563EB',
        drawerInactiveTintColor: '#94A3B8',
        drawerActiveBackgroundColor: '#EFF6FF',
        drawerStyle: { width: 280, backgroundColor: '#0F172A' },
        drawerItemStyle: { borderRadius: 12, paddingHorizontal: 8, marginVertical: 4 },
        drawerLabelStyle: { fontSize: 15, fontWeight: '600', marginLeft: -10 },
      })}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Login"
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Dashboard",
          headerTitle: "Smart Field Survey",
          drawerIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="SurveyPreview"
        options={{
          drawerLabel: "Survey Preview",
          headerTitle: "Survey Preview",
          drawerIcon: ({ color, size }) => <Ionicons name="document-text" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Camera"
        options={{
          drawerLabel: "Camera",
          headerTitle: "Survey Camera",
          drawerIcon: ({ color, size }) => <Ionicons name="camera" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Contacts"
        options={{
          drawerLabel: "Contacts",
          headerTitle: "Contacts",
          drawerIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Location"
        options={{
          drawerLabel: "Location",
          headerTitle: "Location",
          drawerIcon: ({ color, size }) => <Ionicons name="location" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="ClipboardModule"
        options={{
          drawerLabel: "Clipboard",
          headerTitle: "Clipboard",
          drawerIcon: ({ color, size }) => <Ionicons name="clipboard" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Settings"
        options={{
          drawerLabel: "Settings",
          headerTitle: "Settings",
          drawerIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={Platform.OS === 'web' ? undefined : tokenCache}>
      {/* @ts-ignore */}
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ClerkLoaded>
          <DrawerLayout />
        </ClerkLoaded>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#0B1121',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#334155',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  userRole: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  drawerItemsContainer: {
    paddingHorizontal: 10,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    backgroundColor: '#0B1121',
  },
  logoutButtonContainer: {
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 14,
    gap: 10,
  },
  logoutButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  versionText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
  headerMenuButton: {
    marginLeft: 22,
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  }
});