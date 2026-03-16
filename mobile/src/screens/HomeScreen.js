import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions, 
  Animated, 
  SafeAreaView, 
  ScrollView,
  StatusBar,
  Image,
  Pressable
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ChefHat, 
  ArrowRight, 
  Sparkles, 
  Camera, 
  ShoppingBasket,
  Zap,
  Leaf,
  Brain,
  Monitor,
  Search,
  CheckCircle2,
  ArrowRightLeft,
  User as UserIcon,
  PlusCircle,
  X
} from 'lucide-react-native';
import { useAuth } from '../store/auth-store';

const { width, height } = Dimensions.get('window');

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <View style={styles.featureCard}>
    <View style={[styles.featureIconContainer, { backgroundColor: color }]}>
       <Icon size={24} color="white" />
    </View>
    <Text style={styles.featureCardTitle}>{title}</Text>
    <Text style={styles.featureCardDesc}>{description}</Text>
  </View>
);

const FloatingIcon = ({ emoji, initialX, initialY, duration }) => {
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, { toValue: 1, duration: duration, useNativeDriver: true }),
        Animated.timing(moveAnim, { toValue: 0, duration: duration, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const translateY = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <Animated.View style={[styles.floatingChip, { left: initialX, top: initialY, transform: [{ translateY }] }]}>
      <Text style={styles.chipEmoji}>{emoji}</Text>
    </Animated.View>
  );
};

export default function HomeScreen({ navigation }) {
  const { isAuthenticated } = useAuth();

  const handleAction = (screen) => {
    navigation.navigate(screen);
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#FFFFFF', '#F0FFF4', '#DCFCE7']} style={styles.background} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <FloatingIcon emoji="🥚" initialX={width * 0.1} initialY={height * 0.05} duration={3000} />
          <FloatingIcon emoji="🍅" initialX={width * 0.8} initialY={height * 0.15} duration={4000} />
          <FloatingIcon emoji="🥑" initialX={width * 0.05} initialY={height * 0.35} duration={3500} />
          <FloatingIcon emoji="🥕" initialX={width * 0.85} initialY={height * 0.45} duration={4500} />

          <SafeAreaView style={styles.content}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient colors={['#2E7D32', '#66BB6A']} style={styles.logoIcon}>
                  <ChefHat color="white" size={24} />
                </LinearGradient>
                <View>
                  <Text style={styles.brandName}>INGREDIA</Text>
                  <Text style={styles.brandSubtitle}>AI KITCHEN OS</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.profileIconTop} 
                onPress={() => navigation.navigate('ProfileMenu')}
              >
                <UserIcon color="#2E7D32" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.hero}>
              <View style={styles.badge}>
                <Sparkles size={14} color="#2E7D32" />
                <Text style={styles.badgeText}>ELITE CULINARY AI</Text>
              </View>
              
              <Text style={styles.title}>
                Turn Your{'\n'}
                <Text style={styles.titleAccent}>Ingredients</Text>{'\n'}
                Into Recipes.
              </Text>
              
              <Text style={styles.description}>
                The world's most advanced AI for turning random grocery hauls into professional gourmet blue-prints.
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.primaryButton} 
                activeOpacity={0.8} 
                onPress={() => navigation.navigate('Scanner')}
              >
                <LinearGradient colors={['#2E7D32', '#66BB6A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.innerPrimary}>
                  <Text style={styles.primaryButtonText}>GENERATE RECIPE 🍜</Text>
                  <ArrowRight color="white" size={20} />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton} 
                activeOpacity={0.7} 
                onPress={() => handleAction('Dashboard')}
              >
                <Text style={styles.secondaryButtonText}>GO TO KITCHEN</Text>
              </TouchableOpacity>

              {!isAuthenticated && (
                <TouchableOpacity 
                  style={[styles.secondaryButton, { borderColor: 'rgba(0,0,0,0.05)' }]} 
                  activeOpacity={0.7} 
                  onPress={() => navigation.navigate('Auth')}
                >
                  <Text style={[styles.secondaryButtonText, { color: '#6B7280' }]}>JOIN COMMUNITY</Text>
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionBadge}>CORE CAPABILITIES</Text>
          <Text style={styles.sectionTitle}>Available Features</Text>
          <View style={styles.featuresGrid}>
            <FeatureCard 
              icon={Sparkles} 
              title="AI Recipe Engine" 
              description="Unique recipes tailored to your pantry." 
              color="#3B82F6"
            />
            <FeatureCard 
              icon={Search} 
              title="Visual Recognition" 
              description="Snap a photo of your fridge ingredients." 
              color="#9333EA"
            />
            <FeatureCard 
              icon={Leaf} 
              title="Smart Pantry" 
              description="Intelligent tracking with shelf-life alerts." 
              color="#10B981"
            />
            <FeatureCard 
              icon={ChefHat} 
              title="Weekly Planner" 
              description="Plan your meals and schedules in seconds." 
              color="#F97316"
            />
          </View>
        </View>

        {/* How it works */}
        <View style={styles.section}>
          <Text style={styles.sectionBadge}>WORKFLOW</Text>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepCard}>
             <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>01</Text>
             </View>
             <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Add Ingredients</Text>
                <Text style={styles.stepDesc}>Enter items or scan your fridge photo.</Text>
             </View>
          </View>
          <View style={styles.stepCard}>
             <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>02</Text>
             </View>
             <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>AI Analyzes</Text>
                <Text style={styles.stepDesc}>AI finds the best flavor combinations.</Text>
             </View>
          </View>
          <View style={styles.stepCard}>
             <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>03</Text>
             </View>
             <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Get Recipe</Text>
                <Text style={styles.stepDesc}>Complete steps, nutrition and time.</Text>
             </View>
          </View>
        </View>

        <View style={styles.footer}>
           <Text style={styles.footerText}>Ingredia AI Kitchen OS © 2024</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  heroSection: { height: height * 0.9, position: 'relative' },
  content: { flex: 1, paddingHorizontal: 24 },
  header: { marginTop: 20, flexDirection: 'row', alignItems: 'center' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  logoIcon: { padding: 10, borderRadius: 16 },
  brandName: { fontSize: 20, fontWeight: '900', color: '#2E7D32', letterSpacing: -0.5 },
  brandSubtitle: { fontSize: 9, fontWeight: '800', color: '#66BB6A', letterSpacing: 2 },
  profileIconTop: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(46, 125, 50, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.1)',
  },
  hero: { marginTop: 60 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(46, 125, 50, 0.08)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', gap: 6, marginBottom: 20 },
  badgeText: { fontSize: 10, fontWeight: '900', color: '#2E7D32', letterSpacing: 1 },
  title: { fontSize: 40, fontWeight: '900', color: '#1B1B1B', lineHeight: 48, letterSpacing: -1.5, textAlign: 'center', width: '100%', marginTop: 10 },
  titleAccent: { color: '#2E7D32', fontStyle: 'italic' },
  description: { fontSize: 16, color: '#4B5563', lineHeight: 24, marginTop: 24, fontWeight: '500', textAlign: 'center', paddingHorizontal: 10 },
  actions: { marginTop: 50, gap: 16 },
  primaryButton: { width: '100%', height: 68, borderRadius: 34, overflow: 'hidden', shadowColor: '#2E7D32', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 15, elevation: 8 },
  innerPrimary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  primaryButtonText: { color: 'white', fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  secondaryButton: { width: '100%', height: 68, borderRadius: 34, backgroundColor: 'white', borderWidth: 1.5, borderColor: 'rgba(46, 125, 50, 0.15)', justifyContent: 'center', alignItems: 'center' },
  secondaryButtonText: { color: '#2E7D32', fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  floatingChip: { position: 'absolute', backgroundColor: 'white', padding: 12, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 3 },
  chipEmoji: { fontSize: 24 },

  section: { paddingHorizontal: 24, marginTop: 80 },
  sectionBadge: { fontSize: 10, fontWeight: '900', color: '#2E7D32', letterSpacing: 2, textAlign: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 32, fontWeight: '900', color: '#1B1B1B', textAlign: 'center', marginBottom: 40 },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  featureCard: { width: (width - 64) / 2, backgroundColor: 'white', padding: 20, borderRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 1 },
  featureIconContainer: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  featureCardTitle: { fontSize: 16, fontWeight: '800', color: '#1B1B1B', marginBottom: 8 },
  featureCardDesc: { fontSize: 12, color: '#6B7280', lineHeight: 18, fontWeight: '500' },

  stepCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 20, borderRadius: 32, marginBottom: 16, gap: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 1 },
  stepNumberContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(46, 125, 50, 0.05)', justifyContent: 'center', alignItems: 'center' },
  stepNumber: { fontSize: 24, fontWeight: '900', color: '#2E7D32' },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 18, fontWeight: '800', color: '#1B1B1B' },
  stepDesc: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  
  footer: { paddingVertical: 60, alignItems: 'center' },
  footerText: { fontSize: 11, fontWeight: '900', color: '#9CA3AF', letterSpacing: 1 }
});
