import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput,
  FlatList,
  Dimensions,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ChevronRight,
  Sparkles,
  ArrowLeft,
  X,
  ChefHat,
  MessageCircle,
  Share2,
  Heart,
  Clock,
  Flame,
  Search,
  Filter
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  "All", "Indian", "Global", "Quick", "Rescue", "Healthy", "Veg", "Desserts"
];

const ALL_RECIPES = [
  { 
    recipeName: "Paneer Tikka", 
    category: "Indian", 
    time: "25 min", 
    calories: 350,
    difficulty: "Medium", 
    imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800",
  },
  { 
    recipeName: "South Sambar", 
    category: "Indian", 
    time: "30 min", 
    calories: 180,
    difficulty: "Easy", 
    imageUrl: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=800",
  },
  { 
    recipeName: "Thai Basil Chicken", 
    category: "Global", 
    time: "15 min", 
    calories: 420,
    difficulty: "Easy", 
    imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800",
  },
  { 
    recipeName: "Quinoa Bowl", 
    category: "Healthy", 
    time: "10 min", 
    calories: 290,
    difficulty: "Easy", 
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
  },
  { 
    recipeName: "Italian Pasta", 
    category: "Global", 
    time: "15 min", 
    calories: 450,
    difficulty: "Easy", 
    imageUrl: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=800",
  }
];

export default function RecipesScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const filtered = ALL_RECIPES.filter(r => 
    (activeCategory === "All" || r.category === activeCategory) &&
    r.recipeName.toLowerCase().includes(search.toLowerCase())
  );

  const RecipeDetailModal = () => (
    <Modal visible={!!selectedRecipe} animationType="slide" transparent={false}>
      <View style={styles.modalContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.modalImageContainer}>
            <Image source={{ uri: selectedRecipe?.imageUrl }} style={styles.modalImage} />
            <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent']} style={styles.modalHeaderOverlay} />
            <SafeAreaView style={styles.modalContentSafe}>
              <View style={styles.modalActionRow}>
                <TouchableOpacity onPress={() => setSelectedRecipe(null)} style={styles.modalCloseBtn}>
                  <X color="white" size={24} />
                </TouchableOpacity>
                <View style={styles.modalSecondaryActions}>
                   <TouchableOpacity style={styles.modalCircleBtn}><Heart color="white" size={20} /></TouchableOpacity>
                   <TouchableOpacity style={styles.modalCircleBtn}><Share2 color="white" size={20} /></TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </View>

          <View style={styles.modalBody}>
             <View style={styles.modalBadgeRow}>
                <View style={styles.modalBadge}>
                   <ChefHat size={12} color="#2E7D32" />
                   <Text style={styles.modalBadgeText}>{selectedRecipe?.category}</Text>
                </View>
                <Text style={styles.difficultyBadge}>{selectedRecipe?.difficulty}</Text>
             </View>

             <Text style={styles.modalTitle}>{selectedRecipe?.recipeName}</Text>
             <Text style={styles.modalDesc}>A gourmet blueprint curated by Ingredia AI for a balanced and flavorful experience.</Text>

             <View style={styles.modalStatsRow}>
                <View style={styles.modalStat}>
                   <Clock size={18} color="#2E7D32" />
                   <View>
                      <Text style={styles.statLabel}>PREP TIME</Text>
                      <Text style={styles.statVal}>{selectedRecipe?.time}</Text>
                   </View>
                </View>
                <View style={styles.modalStat}>
                   <Flame size={18} color="#2E7D32" />
                   <View>
                      <Text style={styles.statLabel}>CALORIES</Text>
                      <Text style={styles.statVal}>{selectedRecipe?.calories} kcal</Text>
                   </View>
                </View>
             </View>

             <View style={styles.modalSection}>
                <Text style={styles.sectionHeading}>INGREDIENTS USED</Text>
                <View style={styles.ingredientsList}>
                  {['Primary protein', 'Seasonal vegetables', 'Aromatic base', 'Signature spices'].map((ing, i) => (
                    <View key={i} style={styles.ingredientItem}>
                      <View style={styles.bullet} />
                      <Text style={styles.ingredientText}>{ing}</Text>
                    </View>
                  ))}
                </View>
             </View>

             <View style={styles.modalSection}>
                <Text style={styles.sectionHeading}>COOKING GUIDE</Text>
                <View style={styles.instructionsList}>
                  {[
                    "Prep: Wash and organize all ingredients.",
                    "Build: Sauté aromatics until translucent.",
                    "Sizzle: High-heat sear for depth of flavor.",
                    "Simmer: Low-heat finish for tenderness."
                  ].map((step, i) => (
                    <View key={i} style={styles.stepItem}>
                      <View style={styles.stepNumContainer}>
                        <Text style={styles.stepNum}>{i + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
             </View>
          </View>
        </ScrollView>
        <SafeAreaView style={styles.modalFooter}>
           <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>SAVE TO MY KITCHEN</Text>
           </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );

  const renderRecipe = ({ item }) => (
    <TouchableOpacity 
      style={styles.recipeCard} 
      activeOpacity={0.9}
      onPress={() => setSelectedRecipe(item)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeName}>{item.recipeName}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Clock size={12} color="#66BB6A" />
            <Text style={styles.metaText}>{item.time}</Text>
          </View>
          <View style={styles.metaItem}>
            <Flame size={12} color="#66BB6A" />
            <Text style={styles.metaText}>{item.calories} Cal</Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.difficultyText}>{item.difficulty}</Text>
          <ChevronRight size={16} color="#2E7D32" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F0FFF4', '#DCFCE7']}
        style={styles.background}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft color="#1B1B1B" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>
            Culinary <Text style={styles.titleAccent}>Blueprints</Text>
          </Text>
          <Text style={styles.subtitle}>Curated collection of AI-ready recipes.</Text>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={18} color="#9CA3AF" />
            <TextInput 
              placeholder="Search blueprints..."
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Filter size={20} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity 
                key={cat}
                style={[styles.categoryBtn, activeCategory === cat && styles.categoryBtnActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.categoryBtnText, activeCategory === cat && styles.categoryBtnTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList 
          data={filtered}
          renderItem={renderRecipe}
          keyExtractor={item => item.recipeName}
          contentContainerStyle={styles.listContent}
          numColumns={1}
          showsVerticalScrollIndicator={false}
        />

        <RecipeDetailModal />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    marginTop: 10,
  },
  backBtn: {
    marginBottom: 16,
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
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1B1B1B',
    letterSpacing: -1,
  },
  titleAccent: {
    color: '#2E7D32',
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 4,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 24,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    height: 54,
    backgroundColor: 'white',
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#1B1B1B',
  },
  filterBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoriesContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  categoriesScroll: {
    paddingHorizontal: 24,
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryBtnActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  categoryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  categoryBtnTextActive: {
    color: 'white',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 32,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  imageContainer: {
    width: '100%',
    height: 180,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#2E7D32',
    textTransform: 'uppercase',
  },
  recipeInfo: {
    padding: 20,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1B1B1B',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#2E7D32',
    textTransform: 'uppercase',
  },

  modalContainer: { flex: 1, backgroundColor: 'white' },
  modalImageContainer: { height: 350, width: '100%' },
  modalImage: { width: '100%', height: '100%' },
  modalHeaderOverlay: { ...StyleSheet.absoluteFillObject },
  modalContentSafe: { ...StyleSheet.absoluteFillObject },
  modalActionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
  modalCloseBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalSecondaryActions: { flexDirection: 'row', gap: 10 },
  modalCircleBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  
  modalBody: { padding: 24, marginTop: -40, backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40 },
  modalBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  modalBadgeText: { fontSize: 10, fontWeight: '900', color: '#2E7D32', textTransform: 'uppercase' },
  difficultyBadge: { fontSize: 10, fontWeight: '900', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 },
  
  modalTitle: { fontSize: 32, fontWeight: '900', color: '#1B1B1B', marginBottom: 12 },
  modalDesc: { fontSize: 15, color: '#6B7280', lineHeight: 22, fontWeight: '500', marginBottom: 24 },
  
  modalStatsRow: { 
    flexDirection: 'row', 
    gap: 24, 
    paddingVertical: 20, 
    borderTopWidth: 1, 
    borderBottomWidth: 1, 
    borderTopColor: '#F3F4F6', 
    borderBottomColor: '#F3F4F6', 
    marginBottom: 30 
  },
  modalStat: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statLabel: { fontSize: 8, fontWeight: '900', color: '#9CA3AF', letterSpacing: 1 },
  statVal: { fontSize: 16, fontWeight: '900', color: '#1B1B1B' },
  
  modalSection: { marginBottom: 32 },
  sectionHeading: { fontSize: 10, fontWeight: '900', color: '#2E7D32', letterSpacing: 2, marginBottom: 16 },
  ingredientsList: { gap: 12 },
  ingredientItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#66BB6A' },
  ingredientText: { fontSize: 15, fontWeight: '600', color: '#4B5563' },
  
  instructionsList: { gap: 20 },
  stepItem: { flexDirection: 'row', gap: 16 },
  stepNumContainer: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#2E7D32', justifyContent: 'center', alignItems: 'center' },
  stepNum: { color: 'white', fontSize: 12, fontWeight: '900' },
  stepText: { flex: 1, fontSize: 15, color: '#4B5563', lineHeight: 22, fontWeight: '500' },
  
  modalFooter: { padding: 24, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  saveBtn: { backgroundColor: '#2E7D32', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  saveBtnText: { color: 'white', fontSize: 14, fontWeight: '900', letterSpacing: 1 }
});
