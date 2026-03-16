import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { 
  Home as HomeIcon, 
  ChefHat as RecipeIcon, 
  ShoppingBasket as PantryIcon, 
  Calendar as PlannerIcon, 
  User as ProfileIcon,
  Camera as ScanIcon,
  Play
} from 'lucide-react-native';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import HomeScreen from './src/screens/HomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import AuthScreen from './src/screens/AuthScreen';
import RecipesScreen from './src/screens/RecipesScreen';
import PantryScreen from './src/screens/PantryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import PlannerScreen from './src/screens/PlannerScreen';
import ReelsScreen from './src/screens/ReelsScreen';
import ProfileMenuScreen from './src/screens/ProfileMenuScreen';

import { useAuth } from './src/store/auth-store';
import { useDataStore } from './src/store/data-store';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -15,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={onPress}
  >
    <LinearGradient
      colors={['#2E7D32', '#66BB6A']}
      style={{
        width: 68,
        height: 68,
        borderRadius: 34,
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {children}
    </LinearGradient>
  </TouchableOpacity>
);

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          height: 90,
          paddingBottom: 30,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 5,
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '900',
          letterSpacing: 0.5,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color }) => <HomeIcon size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Recipes" 
        component={RecipesScreen} 
        options={{
          tabBarIcon: ({ color }) => <RecipeIcon size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Scanner" 
        component={ScannerScreen} 
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => <ScanIcon size={32} color="white" />,
          tabBarButton: (props) => <CustomTabBarButton {...props} />
        }}
      />
      <Tab.Screen 
        name="Reels" 
        component={ReelsScreen} 
        options={{
          tabBarIcon: ({ color }) => <Play size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Planner" 
        component={PlannerScreen} 
        options={{
          tabBarIcon: ({ color }) => <PlannerIcon size={24} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { loadUser, isAuthenticated } = useAuth();
  const loadData = useDataStore(state => state.loadAll);

  useEffect(() => {
    loadUser();
    loadData();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="ProfileMenu" component={ProfileMenuScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Pantry" component={PantryScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
