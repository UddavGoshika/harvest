import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  TextInput,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User,
  Shield,
  Bell,
  CreditCard,
  ChevronRight,
  LogOut,
  ChefHat,
  Leaf,
  LogIn
} from 'lucide-react-native';
import { useAuth } from '../store/auth-store';

const SettingItem = ({ icon: Icon, label, value, type = 'link', onValueChange }) => (
  <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
    <View style={styles.settingIconContainer}>
      <Icon size={20} color="#2E7D32" />
    </View>
    <View style={styles.settingTextContainer}>
      <Text style={styles.settingLabel}>{label}</Text>
      {value && <Text style={styles.settingValueText}>{value}</Text>}
    </View>
    {type === 'link' ? (
      <ChevronRight size={18} color="#D1D5DB" />
    ) : (
      <Switch 
        value={value} 
        onValueChange={onValueChange}
        trackColor={{ false: "#E5E7EB", true: "#A5D6A7" }}
        thumbColor={value ? "#2E7D32" : "#F4F3F4"}
      />
    )}
  </TouchableOpacity>
);

export default function SettingsScreen({ navigation }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [wasteReminders, setWasteReminders] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigation.replace('Auth');
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#FFFFFF', '#F0FFF4', '#DCFCE7']} style={styles.background} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.authPrompt}>
            <View style={styles.authIconCircle}>
              <User color="#2E7D32" size={40} />
            </View>
            <Text style={styles.authTitle}>Join Ingredia</Text>
            <Text style={styles.authSubtitle}>Sign in to unlock AI meal planning, fridge tracking and personal recipe vault.</Text>
            
            <TouchableOpacity 
              style={styles.primaryAuthBtn} 
              onPress={() => navigation.navigate('Auth')}
            >
              <LinearGradient colors={['#2E7D32', '#66BB6A']} style={styles.authBtnGradient}>
                <LogIn color="white" size={20} />
                <Text style={styles.authBtnText}>SIGN IN / REGISTER</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFFFFF', '#F0FFF4', '#DCFCE7']} style={styles.background} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Kitchen Settings</Text>
          <Text style={styles.subtitle}>Manage your gourmet profile and preferences.</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <Image 
              source={{ uri: user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=chef' }} 
              style={styles.avatar} 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.displayName || 'Elite Chef'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'chef@harvest.com'}</Text>
              <View style={styles.planBadge}>
                <Text style={styles.planText}>{user?.plan || 'FREE EXPLORER'}</Text>
              </View>
            </View>
          </View>

          {/* Settings Groups */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACCOUNT & SECURITY</Text>
            <View style={styles.groupCard}>
              <SettingItem icon={User} label="Profile Information" />
              <SettingItem icon={Shield} label="Security & Privacy" />
              <SettingItem icon={CreditCard} label="Subscription Plan" value={user?.plan || 'Free'} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>KITCHEN PREFERENCES</Text>
            <View style={styles.groupCard}>
              <SettingItem 
                icon={Bell} 
                label="Daily Notifications" 
                type="switch" 
                value={notifications}
                onValueChange={setNotifications}
              />
              <SettingItem 
                icon={Leaf} 
                label="Waste Rescue Alerts" 
                type="switch" 
                value={wasteReminders}
                onValueChange={setWasteReminders}
              />
              <SettingItem icon={ChefHat} label="Culinary Style" value="Indian / Global" />
            </View>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
             <LogOut color="#EF4444" size={20} />
             <Text style={styles.logoutBtnText}>TERMINATE SESSION</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>Ingredia Mobile v1.4.2 (Production)</Text>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  background: { ...StyleSheet.absoluteFillObject },
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 24, marginTop: 20, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '900', color: '#1B1B1B', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#6B7280', fontWeight: '600', marginTop: 2 },
  scrollContent: { paddingBottom: 40 },
  
  profileCard: {
    marginHorizontal: 24,
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  profileName: { fontSize: 20, fontWeight: '900', color: '#1B1B1B' },
  profileEmail: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginTop: 2 },
  planBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(46, 125, 50, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 10,
  },
  planText: { fontSize: 9, fontWeight: '900', color: '#2E7D32', letterSpacing: 0.5 },

  section: { marginTop: 30, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 10, fontWeight: '900', color: '#9CA3AF', letterSpacing: 1.5, marginBottom: 16, marginLeft: 10 },
  groupCard: {
    backgroundColor: 'white',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  settingItem: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(46, 125, 50, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTextContainer: { flex: 1, marginLeft: 16 },
  settingLabel: { fontSize: 15, fontWeight: '800', color: '#1B1B1B' },
  settingValueText: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginTop: 1 },

  logoutBtn: {
    marginHorizontal: 24,
    marginTop: 40,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
  },
  logoutBtnText: { color: '#EF4444', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  versionText: { textAlign: 'center', marginTop: 30, fontSize: 10, color: '#CBD5E1', fontWeight: '700' },

  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  authIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(46, 125, 50, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1B1B1B',
    marginBottom: 12,
  },
  authSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  primaryAuthBtn: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  authBtnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  authBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  }
});
