import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Calendar, 
  ShoppingBasket, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles, 
  ChevronRight,
  ArrowUpRight,
  ChefHat,
  Clock,
  Flame,
  ArrowLeft
} from 'lucide-react-native';
import { useDataStore } from '../store/data-store';

const { width } = Dimensions.get('window');

const InsightStat = ({ icon: Icon, label, value }) => (
  <View style={styles.statCard}>
    <View style={styles.statIconContainer}>
      <Icon size={20} color="#2E7D32" />
    </View>
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  </View>
);

export default function DashboardScreen({ navigation }) {
  const { pantry, planner, loadAll } = useDataStore();

  useEffect(() => {
    loadAll();
  }, []);

  const expiringSoon = pantry.filter(item => {
    const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return daysLeft >= 0 && daysLeft <= 3;
  });

  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  const todayMeals = planner[today] || [];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFFFFF', '#F0FFF4', '#DCFCE7']} style={styles.background} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ArrowLeft color="#1B1B1B" size={24} />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.title}>Kitchen Dashboard</Text>
              <Text style={styles.subtitle}>Daily overview of your AI-managed kitchen.</Text>
            </View>
          </View>

          {/* Today's Menu Card */}
          <LinearGradient
            colors={['#2E7D32', '#1B5E20']}
            style={styles.menuCard}
          >
            <View style={styles.menuHeader}>
              <View style={styles.menuIconCircle}>
                <Calendar color="white" size={24} />
              </View>
              <View>
                <Text style={styles.menuTitle}>Today's Menu</Text>
                <Text style={styles.menuSubtitle}>{today}</Text>
              </View>
            </View>

            <View style={styles.menuList}>
              {todayMeals.length > 0 ? (
                todayMeals.map((meal, idx) => (
                  <TouchableOpacity key={idx} style={styles.mealItem}>
                    <View style={styles.mealInfo}>
                      <Text style={styles.mealName}>{meal.recipeName}</Text>
                      <View style={styles.mealMeta}>
                        <Clock size={12} color="rgba(255,255,255,0.6)" />
                        <Text style={styles.mealMetaText}>{meal.estimatedPrepTime}</Text>
                        <Flame size={12} color="rgba(255,255,255,0.6)" />
                        <Text style={styles.mealMetaText}>{meal.nutrition?.calories || 450} kcal</Text>
                      </View>
                    </View>
                    <ArrowUpRight color="rgba(255,255,255,0.4)" size={20} />
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyMenu}>
                  <ChefHat color="rgba(255,255,255,0.3)" size={48} />
                  <Text style={styles.emptyMenuText}>No meals planned for today.</Text>
                  <TouchableOpacity style={styles.plannerBtn} onPress={() => navigation.navigate('Recipes')}>
                    <Text style={styles.plannerBtnText}>EXPLORE RECIPES</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </LinearGradient>

          {/* Pantry Health Card */}
          <View style={styles.pantryCard}>
            <View style={styles.pantryHeader}>
              <View>
                <Text style={styles.pantryTitle}>Pantry Health</Text>
                <Text style={styles.pantrySubtitle}>Inventory alerts and expiry tracking.</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Pantry')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pantryContent}>
              {expiringSoon.length > 0 ? (
                <View style={styles.alertList}>
                  <View style={styles.alertBadge}>
                    <AlertTriangle color="#EF4444" size={14} />
                    <Text style={styles.alertBadgeText}>EXPIRING SOON</Text>
                  </View>
                  {expiringSoon.slice(0, 2).map((item, idx) => (
                    <View key={idx} style={styles.alertItem}>
                      <ShoppingBasket color="#EF4444" size={20} />
                      <View style={styles.alertInfo}>
                        <Text style={styles.alertName}>{item.name}</Text>
                        <Text style={styles.alertQty}>{item.quantity}</Text>
                      </View>
                      <View style={styles.rescueBadge}>
                        <Text style={styles.rescueText}>RESCUE</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.allFresh}>
                  <Sparkles color="#66BB6A" size={32} />
                  <Text style={styles.allFreshText}>Everything is fresh!</Text>
                </View>
              )}
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
             <InsightStat icon={TrendingUp} label="WEEKLY GOAL" value="4/7 Meals" />
             <InsightStat icon={Sparkles} label="AI PRECISION" value="98%" />
             <InsightStat icon={ShoppingBasket} label="RESCUE SCORE" value="A+" />
             <InsightStat icon={ChefHat} label="CHEF LEVEL" value="Master" />
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  background: { ...StyleSheet.absoluteFillObject },
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { 
    paddingHorizontal: 24, 
    marginTop: 10, 
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  headerInfo: { flex: 1 },
  title: { fontSize: 24, fontWeight: '900', color: '#1B1B1B', letterSpacing: -0.5 },
  subtitle: { fontSize: 11, color: '#6B7280', fontWeight: '600', marginTop: 2 },
  
  menuCard: {
    marginHorizontal: 24,
    borderRadius: 36,
    padding: 24,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  menuIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: { fontSize: 20, fontWeight: '900', color: 'white' },
  menuSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '700' },
  menuList: { gap: 12 },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  mealName: { fontSize: 16, fontWeight: '800', color: 'white' },
  mealMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  mealMetaText: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' },
  
  emptyMenu: { alignItems: 'center', paddingVertical: 20, gap: 12 },
  emptyMenuText: { color: 'rgba(255,255,255,0.6)', fontWeight: '700', italic: true },
  plannerBtn: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  plannerBtnText: { color: '#2E7D32', fontWeight: '900', fontSize: 11 },

  pantryCard: {
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: 'white',
    borderRadius: 36,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  pantryHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pantryTitle: { fontSize: 18, fontWeight: '900', color: '#1B1B1B' },
  pantrySubtitle: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  viewAllText: { fontSize: 13, fontWeight: '800', color: '#2E7D32' },
  pantryContent: { padding: 24 },
  alertList: { gap: 16 },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  alertBadgeText: { fontSize: 10, fontWeight: '900', color: '#EF4444', letterSpacing: 1 },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.03)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.08)',
  },
  alertInfo: { flex: 1, marginLeft: 16 },
  alertName: { fontSize: 16, fontWeight: '800', color: '#1B1B1B' },
  alertQty: { fontSize: 10, fontWeight: '900', color: '#9CA3AF', textTransform: 'uppercase' },
  rescueBadge: { backgroundColor: '#EF4444', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  rescueText: { color: 'white', fontSize: 9, fontWeight: '900' },
  
  allFresh: { alignItems: 'center', paddingVertical: 20, gap: 10 },
  allFreshText: { color: '#6B7280', fontWeight: '800', fontSize: 14 },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    marginTop: 24,
    gap: 12,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.05)',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(46, 125, 50, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: { fontSize: 8, fontWeight: '900', color: '#9CA3AF', letterSpacing: 1 },
  statValue: { fontSize: 14, fontWeight: '900', color: '#1B1B1B' }
});
