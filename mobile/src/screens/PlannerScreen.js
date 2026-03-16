import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Image,
  FlatList,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Plus, 
  ChefHat, 
  LayoutGrid, 
  ChevronRight, 
  Clock, 
  Flame,
  Trash2,
  Calendar,
  ArrowLeft,
  Camera,
  Users,
  Activity,
  Sparkles,
  X,
  HeartPulse,
  Upload as UploadIcon,
  Info
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDataStore } from '../store/data-store';

const { width } = Dimensions.get('window');
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PlannerScreen({ navigation }) {
  const { planner, setPlanner, loadAll } = useDataStore();
  const [showAIModal, setShowAIModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [members, setMembers] = useState("4");
  const [healthGoals, setHealthGoals] = useState("Weight management & Heart healthy");
  const [marketImage, setMarketImage] = useState(null);
  const [genStep, setGenStep] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  const handlePickMarket = async (type) => {
    let result;
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') return;
      result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.7 });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.7 });
    }

    if (!result.canceled) {
      setMarketImage(result.assets[0].uri);
    }
  };

  const handleAISchedule = async () => {
    setShowAIModal(false);
    setIsGenerating(true);
    
    // Simulated AI Steps
    setGenStep("Connecting to Google Vision AI...");
    await new Promise(r => setTimeout(r, 1200));
    setGenStep("Analyzing ingredients from OpenRouter...");
    await new Promise(r => setTimeout(r, 1500));
    setGenStep("Optimizing for " + members + " members...");
    await new Promise(r => setTimeout(r, 1200));
    setGenStep("Finalizing health-first schedule...");
    await new Promise(r => setTimeout(r, 1000));

    const mockSchedule = {
      Monday: [
        { recipeName: "Quinoa Salad", estimatedPrepTime: "15 min", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600" },
        { recipeName: "Grilled Salmon", estimatedPrepTime: "25 min", imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=600" }
      ],
      Tuesday: [
        { recipeName: "Avocado Toast", estimatedPrepTime: "10 min", imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600" },
        { recipeName: "Lentil Soup", estimatedPrepTime: "30 min", imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=600" }
      ],
      Wednesday: [
        { recipeName: "Stir Fry Veggies", estimatedPrepTime: "15 min", imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=600" }
      ],
      Thursday: [
        { recipeName: "Greek Salad", estimatedPrepTime: "10 min", imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=600" }
      ],
      Friday: [
        { recipeName: "Homemade Pizza", estimatedPrepTime: "40 min", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600" }
      ],
      Saturday: [
        { recipeName: "Pancakes", estimatedPrepTime: "20 min", imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?q=80&w=600" }
      ],
      Sunday: [
        { recipeName: "Roast Chicken", estimatedPrepTime: "60 min", imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=600" }
      ]
    };
    await setPlanner(mockSchedule);
    setIsGenerating(false);
  };

  const removeItem = async (day, index) => {
    const updated = { ...planner };
    updated[day] = updated[day].filter((_, i) => i !== index);
    await setPlanner(updated);
  };

  const renderDaySection = (day) => {
    const dayRecipes = planner[day] || [];
    return (
      <View key={day} style={styles.daySection}>
        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>{day}</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Plus color="#2E7D32" size={18} />
          </TouchableOpacity>
        </View>

        {dayRecipes.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mealScroll}>
            {dayRecipes.map((recipe, idx) => (
              <View key={idx} style={styles.mealCard}>
                <Image 
                  source={{ uri: recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000" }} 
                  style={styles.mealImage} 
                />
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName} numberOfLines={1}>{recipe.recipeName}</Text>
                  <View style={styles.mealMeta}>
                    <Clock size={10} color="#6B7280" />
                    <Text style={styles.mealMetaText}>{recipe.estimatedPrepTime}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeItem(day, idx)} style={styles.removeBtn}>
                     <Trash2 color="#EF4444" size={14} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyDay}>
            <Text style={styles.emptyDayText}>Quiet Day • No meals scheduled</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFFFFF', '#F0FFF4', '#DCFCE7']} style={styles.background} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ArrowLeft color="#1B1B1B" size={24} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <View style={styles.badge}>
                <ChefHat size={12} color="#2E7D32" />
                <Text style={styles.badgeText}>MEAL MANAGEMENT</Text>
              </View>
              <Text style={styles.title}>Recipe Planner</Text>
              <Text style={styles.subtitle}>Transform fridge items into a 7-day schedule.</Text>
            </View>
            <TouchableOpacity 
              style={styles.headerIcon}
              onPress={() => navigation.navigate('Scanner')}
            >
              <Camera color="#2E7D32" size={24} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.aiBtn} onPress={() => setShowAIModal(true)}>
            <LinearGradient colors={['#2E7D32', '#66BB6A']} style={styles.aiBtnInner}>
              <Sparkles color="white" size={20} />
              <Text style={styles.aiBtnText}>AI SCHEDULE COMPLETE WEEK</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.daysList}>
            {DAYS.map(renderDaySection)}
          </View>

        </ScrollView>

        {/* AI Configuration Modal */}
        <Modal visible={showAIModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeaderInner}>
                 <View>
                    <Text style={styles.modalTitleInner}>AI Planner Config</Text>
                    <Text style={styles.modalSubtitleInner}>Tailoring the engine to your family.</Text>
                 </View>
                 <TouchableOpacity onPress={() => setShowAIModal(false)} style={styles.modalCloseBtn}>
                    <X color="#6B7280" size={24} />
                 </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 500 }}>
                <View style={styles.marketHaulSection}>
                   <View style={styles.inputLabelRow}>
                      <Camera size={16} color="#2E7D32" />
                      <Text style={styles.inputLabel}>MARKET HAUL PICTURE</Text>
                   </View>
                   <View style={styles.imageActionRow}>
                      {marketImage ? (
                        <View style={styles.previewContainer}>
                          <Image source={{ uri: marketImage }} style={styles.haulPreview} />
                          <TouchableOpacity style={styles.removeImage} onPress={() => setMarketImage(null)}>
                             <X size={12} color="white" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={styles.emptyHaul}>
                           <Text style={styles.emptyHaulText}>Snap or upload your groceries</Text>
                        </View>
                      )}
                      
                      <View style={styles.imageButtons}>
                         <TouchableOpacity style={styles.mediaBtn} onPress={() => handlePickMarket('camera')}>
                            <Camera size={16} color="#2E7D32" />
                            <Text style={styles.mediaBtnText}>Live</Text>
                         </TouchableOpacity>
                         <TouchableOpacity style={styles.mediaBtn} onPress={() => handlePickMarket('gallery')}>
                            <UploadIcon size={16} color="#2E7D32" />
                            <Text style={styles.mediaBtnText}>Upload</Text>
                         </TouchableOpacity>
                      </View>
                   </View>
                </View>

                <View style={styles.inputGroup}>
                   <View style={styles.inputLabelRow}>
                      <Users size={16} color="#2E7D32" />
                      <Text style={styles.inputLabel}>HOUSEHOLD MEMBERS</Text>
                   </View>
                   <TextInput 
                     style={styles.textInput}
                     value={members}
                     onChangeText={setMembers}
                     keyboardType="numeric"
                     placeholder="e.g. 4"
                   />
                </View>

                <View style={styles.inputGroup}>
                   <View style={styles.inputLabelRow}>
                      <Activity size={16} color="#2E7D32" />
                      <Text style={styles.inputLabel}>HEALTH & DIETARY GOALS</Text>
                   </View>
                   <TextInput 
                     style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
                     value={healthGoals}
                     onChangeText={setHealthGoals}
                     multiline
                     placeholder="e.g. Low sodium, high protein..."
                   />
                </View>

                <View style={styles.infoBox}>
                   <Info size={14} color="#2E7D32" />
                   <Text style={styles.infoText}>Analyzing haul via Google Vision AI & OpenRouter...</Text>
                </View>
              </ScrollView>

              <TouchableOpacity style={styles.startBtn} onPress={handleAISchedule}>
                 <LinearGradient colors={['#2E7D32', '#66BB6A']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.startBtnInner}>
                    <Text style={styles.startBtnText}>START AI ENGINE</Text>
                    <ChevronRight color="white" size={20} />
                 </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* AI Generation Overlay */}
        <Modal visible={isGenerating} transparent>
          <View style={styles.genOverlay}>
            <View style={styles.genCard}>
               <ActivityIndicator size="large" color="#2E7D32" />
               <Text style={styles.genTitle}>Strategizing...</Text>
               <Text style={styles.genSubtitle}>{genStep}</Text>
               <View style={styles.genProgress}>
                  <LinearGradient 
                    colors={['#A5D6A7', '#2E7D32']} 
                    style={{ height: '100%', width: '70%', borderRadius: 3 }}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                  />
               </View>
            </View>
          </View>
        </Modal>
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
  headerContent: { flex: 1 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(46, 125, 50, 0.08)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', gap: 6, marginBottom: 8 },
  badgeText: { fontSize: 9, fontWeight: '900', color: '#2E7D32', letterSpacing: 1 },
  title: { fontSize: 24, fontWeight: '900', color: '#1B1B1B', letterSpacing: -1 },
  subtitle: { fontSize: 11, color: '#6B7280', fontWeight: '500', italic: true, marginTop: 2 },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(46, 125, 50, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  aiBtn: { marginHorizontal: 24, marginTop: 30, height: 64, borderRadius: 32, overflow: 'hidden', shadowColor: '#2E7D32', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 8 },
  aiBtnInner: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  aiBtnText: { color: 'white', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  
  daysList: { marginTop: 40, gap: 10 },
  daySection: { marginBottom: 30 },
  dayHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 16, gap: 16 },
  dayTitle: { fontSize: 22, fontWeight: '900', color: '#1B1B1B' },
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'white', borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  
  mealScroll: { paddingLeft: 24, paddingRight: 40, gap: 16 },
  mealCard: { width: 160, backgroundColor: 'white', borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)' },
  mealImage: { width: '100%', height: 100 },
  mealInfo: { padding: 12, gap: 4 },
  mealName: { fontSize: 14, fontWeight: '800', color: '#1B1B1B' },
  mealMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  mealMetaText: { fontSize: 10, color: '#6B7280', fontWeight: '700' },
  removeBtn: { position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(239, 68, 68, 0.05)', justifyContent: 'center', alignItems: 'center' },
  
  emptyDay: { marginHorizontal: 24, padding: 20, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(46, 125, 50, 0.1)', alignItems: 'center' },
  emptyDayText: { color: '#9CA3AF', fontSize: 12, fontWeight: '700', italic: true },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, paddingBottom: 50 },
  modalHeaderInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  modalTitleInner: { fontSize: 22, fontWeight: '900', color: '#1B1B1B' },
  modalSubtitleInner: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  modalCloseBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' },
  
  marketHaulSection: { marginBottom: 24 },
  imageActionRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  previewContainer: { position: 'relative' },
  haulPreview: { width: 80, height: 80, borderRadius: 16 },
  removeImage: { position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderRadius: 10, backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center' },
  emptyHaul: { width: 80, height: 80, borderRadius: 16, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', padding: 10 },
  emptyHaulText: { fontSize: 8, color: '#9CA3AF', fontWeight: '800', textAlign: 'center' },
  imageButtons: { gap: 10, flex: 1 },
  mediaBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F9FAFB', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  mediaBtnText: { fontSize: 11, fontWeight: '800', color: '#1B1B1B' },

  inputGroup: { marginBottom: 24 },
  inputLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  inputLabel: { fontSize: 10, fontWeight: '900', color: '#2E7D32', letterSpacing: 1 },
  textInput: { backgroundColor: '#F9FAFB', borderRadius: 20, padding: 16, fontSize: 15, fontWeight: '500', color: '#1B1B1B', borderWidth: 1, borderColor: '#F3F4F6' },
  
  infoBox: { flexDirection: 'row', gap: 10, backgroundColor: 'rgba(46, 125, 50, 0.05)', padding: 16, borderRadius: 20, marginBottom: 30 },
  infoText: { flex: 1, fontSize: 12, color: '#2E7D32', fontWeight: '600', lineHeight: 18 },
  
  startBtn: { height: 64, borderRadius: 32, overflow: 'hidden' },
  startBtnInner: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  startBtnText: { color: 'white', fontSize: 13, fontWeight: '900', letterSpacing: 1 },

  genOverlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.95)', justifyContent: 'center', alignItems: 'center' },
  genCard: { alignItems: 'center', width: '80%', gap: 20 },
  genTitle: { fontSize: 24, fontWeight: '900', color: '#1B1B1B' },
  genSubtitle: { fontSize: 14, color: '#2E7D32', fontWeight: '700', textAlign: 'center' },
  genProgress: { width: '100%', height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }
});
