import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Settings as SettingsIcon, 
  Heart, 
  ShoppingBasket, 
  LogOut, 
  X,
  ChevronRight,
  Shield,
  CreditCard,
  ChefHat
} from 'lucide-react-native';
import { useAuth } from '../store/auth-store';

const { width } = Dimensions.get('window');

const MenuItem = ({ icon: Icon, title, subtitle, onPress, destructive = false }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={[styles.iconContainer, destructive && styles.destructiveIcon]}>
      <Icon size={20} color={destructive ? "#EF4444" : "#2E7D32"} />
    </View>
    <View style={styles.menuText}>
      <Text style={[styles.menuTitle, destructive && styles.destructiveText]}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    <ChevronRight size={18} color="#D1D5DB" />
  </TouchableOpacity>
);

export default function ProfileMenuScreen({ navigation }) {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFFFFF', '#F0FFF4', '#DCFCE7']} style={styles.background} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <X color="#1B1B1B" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {isAuthenticated ? (
            <View style={styles.profileCard}>
              <Image 
                source={{ uri: user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=chef' }} 
                style={styles.avatar} 
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.displayName || 'Elite Chef'}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
                <View style={styles.planBadge}>
                  <Text style={styles.planText}>{user?.plan || 'PRO'} MEMBER</Text>
                </View>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.authPrompt} onPress={() => navigation.navigate('Auth')}>
              <View style={styles.authAvatar}>
                <User color="#2E7D32" size={30} />
              </View>
              <View style={styles.authText}>
                <Text style={styles.authTitle}>Sign In / Register</Text>
                <Text style={styles.authSubtitle}>Unlock premium features & sync data.</Text>
              </View>
              <ChevronRight size={20} color="#2E7D32" />
            </TouchableOpacity>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PREFERENCES & SETTINGS</Text>
            <View style={styles.menuGroup}>
              <MenuItem 
                icon={SettingsIcon} 
                title="Account Settings" 
                subtitle="Manage your profile & security" 
                onPress={() => navigation.navigate('Settings')}
              />
              <MenuItem 
                icon={ChefHat} 
                title="Preferences" 
                subtitle="Cuisine & dietary settings"
                onPress={() => navigation.navigate('Settings')}
              />
              <MenuItem 
                icon={Heart} 
                title="Saved Items" 
                subtitle="Your collection of recipes"
                onPress={() => navigation.navigate('Recipes')}
              />
              <MenuItem 
                icon={ShoppingBasket} 
                title="Pantry" 
                subtitle="Manage your ingredients"
                onPress={() => navigation.navigate('Pantry')}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SYSTEM</Text>
            <View style={styles.menuGroup}>
              <MenuItem icon={Shield} title="Privacy Policy" />
              <MenuItem icon={CreditCard} title="Subscription Plan" />
            </View>
          </View>

          {isAuthenticated && (
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <LogOut color="#EF4444" size={20} />
              <Text style={styles.logoutText}>TERMINATE SESSION</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.footerText}>Ingredia Mobile v1.4.2 (Production)</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  background: { ...StyleSheet.absoluteFillObject },
  safeArea: { flex: 1 },
  header: { 
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 24,
    marginTop: 10
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#1B1B1B' },
  closeBtn: { padding: 4 },
  scrollContent: { paddingBottom: 40 },
  
  profileCard: {
    marginHorizontal: 24,
    marginTop: 20,
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
  },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  profileInfo: { marginLeft: 20, flex: 1 },
  profileName: { fontSize: 20, fontWeight: '900', color: '#1B1B1B' },
  profileEmail: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  planBadge: { alignSelf: 'flex-start', backgroundColor: '#DCFCE7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, marginTop: 10 },
  planText: { fontSize: 9, fontWeight: '900', color: '#2E7D32' },

  authPrompt: {
    marginHorizontal: 24,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  authAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(46, 125, 50, 0.05)', justifyContent: 'center', alignItems: 'center' },
  authText: { flex: 1, marginLeft: 16 },
  authTitle: { fontSize: 18, fontWeight: '900', color: '#1B1B1B' },
  authSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  section: { marginTop: 32, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 10, fontWeight: '900', color: '#9CA3AF', letterSpacing: 1.5, marginBottom: 16, marginLeft: 8 },
  menuGroup: { backgroundColor: 'white', borderRadius: 28, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 1 },
  menuItem: { padding: 18, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  iconContainer: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(46, 125, 50, 0.05)', justifyContent: 'center', alignItems: 'center' },
  menuText: { flex: 1, marginLeft: 16 },
  menuTitle: { fontSize: 15, fontWeight: '800', color: '#1B1B1B' },
  menuSubtitle: { fontSize: 11, color: '#6B7280', marginTop: 1 },

  logoutBtn: {
    marginHorizontal: 24,
    marginTop: 40,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
  },
  logoutText: { color: '#EF4444', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  footerText: { textAlign: 'center', marginTop: 40, fontSize: 10, color: '#CBD5E1', fontWeight: '700' }
});
