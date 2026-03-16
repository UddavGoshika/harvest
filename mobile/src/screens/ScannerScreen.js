import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  TextInput,
  Image,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Zap, 
  ChefHat, 
  RotateCcw, 
  Globe, 
  Trophy,
  Maximize,
  List,
  Plus,
  Upload,
  ArrowRight,
  Sparkles,
  X,
  Loader2,
  Camera as CameraIconLucide
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const MODES = [
  { id: 'standard', label: 'STANDARD', icon: ChefHat, description: 'AI designs balanced gourmet recipes from your available ingredients.' },
  { id: 'rescue', label: 'LEFTOVER RESCUE', icon: RotateCcw, description: 'Saves ingredients about to expire by turning them into delicious meals.' },
  { id: 'global', label: 'GLOBAL DISCOVERY', icon: Globe, description: 'Fuses your local ingredients with exotic world cuisines.' },
  { id: 'challenge', label: 'MYSTERY CHALLENGE', icon: Trophy, description: 'A gamified experience where the AI gives you a secret ingredient.' },
];

export default function ScannerScreen({ navigation }) {
  const [activeMode, setActiveMode] = useState('standard');
  const [inputMethod, setInputMethod] = useState('visual'); 
  const [detectedItems, setDetectedItems] = useState([]);
  const [inputText, setInputText] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState("");

  const currentMode = MODES.find(m => m.id === activeMode) || MODES[0];

  const addIngredient = (name) => {
    if (!name || name.trim() === "") return;
    const items = name.split(',').map(i => i.trim()).filter(i => i !== "");
    setDetectedItems(prev => [...new Set([...prev, ...items])]);
    setManualInput("");
    setInputText("");
  };

  const removeIngredient = (name) => {
    setDetectedItems(prev => prev.filter(i => i !== name));
  };

  const handleLiveScan = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required to scan ingredients.');
      return;
    }
    
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleMockScan();
    }
  };

  const handleUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleMockScan();
    }
  };

  const handleMockScan = async () => {
    setIsGenerating(true);
    setGenStep("AI is peering into your fridge...");
    await new Promise(r => setTimeout(r, 1500));
    const mock = ["Fresh Paneer", "Green Peas", "Red Onions", "Cilantro"];
    setDetectedItems(prev => [...new Set([...prev, ...mock])]);
    setIsGenerating(false);
    setGenStep("");
  };

  const handleGenerate = async () => {
    if (detectedItems.length === 0 && inputText === "") return;
    setIsGenerating(true);
    setGenStep("Consulting Harvest AI Engine...");
    await new Promise(r => setTimeout(r, 1200));
    setGenStep("Optimizing " + activeMode + " flavors...");
    await new Promise(r => setTimeout(r, 1000));
    setGenStep("Constructing gourmet blueprint...");
    await new Promise(r => setTimeout(r, 800));
    setIsGenerating(false);
    navigation.navigate('Recipes');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F0FFF4', '#DCFCE7']} style={styles.background} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft color="#1B1B1B" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Recipe Generator</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Mode Selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modesContainer}>
            {MODES.map((mode) => {
              const Icon = mode.icon;
              return (
                <TouchableOpacity 
                  key={mode.id} 
                  onPress={() => setActiveMode(mode.id)}
                  style={[styles.modeBtn, activeMode === mode.id && styles.modeBtnActive]}
                >
                  <Icon size={16} color={activeMode === mode.id ? 'white' : '#2E7D32'} />
                  <Text style={[styles.modeLabel, activeMode === mode.id && styles.modeLabelActive]}>
                    {mode.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.modeDescriptionContainer}>
            <Text style={styles.modeDescription}>{currentMode.description}</Text>
          </View>

          {/* Main Interface Card */}
          <View style={styles.mainCard}>
            {/* Input Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                onPress={() => setInputMethod('visual')}
                style={[styles.toggleBtn, inputMethod === 'visual' && styles.toggleBtnActive]}
              >
                <CameraIconLucide size={16} color={inputMethod === 'visual' ? 'white' : '#6B7280'} />
                <Text style={[styles.toggleLabel, inputMethod === 'visual' && styles.toggleLabelActive]}>Visual Scanner</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setInputMethod('list')}
                style={[styles.toggleBtn, inputMethod === 'list' && styles.toggleBtnActive]}
              >
                <List size={16} color={inputMethod === 'list' ? 'white' : '#6B7280'} />
                <Text style={[styles.toggleLabel, inputMethod === 'list' && styles.toggleLabelActive]}>Smart List</Text>
              </TouchableOpacity>
            </View>

            {inputMethod === 'visual' ? (
              <View style={styles.scannerInterface}>
                <View style={styles.scannerHeader}>
                   <View style={styles.scannerTitleRow}>
                      <Maximize size={18} color="#2E7D32" />
                      <Text style={styles.scannerTitle}>Fridge Scanner</Text>
                   </View>
                   <View style={styles.scanActions}>
                      <TouchableOpacity style={styles.miniBtn} onPress={handleLiveScan}>
                        <CameraIconLucide size={14} color="#1B1B1B" />
                        <Text style={styles.miniBtnText}>Live Scan</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.miniBtn} onPress={handleUpload}>
                        <Upload size={14} color="#1B1B1B" />
                        <Text style={styles.miniBtnText}>Upload</Text>
                      </TouchableOpacity>
                   </View>
                </View>
                <Text style={styles.scannerSubtitle}>AI detects ingredients automatically from your camera.</Text>

                <View style={styles.detectionBox}>
                  <View style={styles.detectionHeader}>
                    <Text style={styles.detectionTitle}>AI DETECTED INGREDIENTS</Text>
                    <View style={styles.manualAdd}>
                      <TextInput 
                        placeholder="Add more..." 
                        style={styles.manualInput}
                        placeholderTextColor="#9CA3AF"
                        value={manualInput}
                        onChangeText={setManualInput}
                        onSubmitEditing={() => addIngredient(manualInput)}
                      />
                      <TouchableOpacity onPress={() => addIngredient(manualInput)}>
                        <Plus size={16} color="#2E7D32" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.itemsScrollContainer}>
                    {detectedItems.length > 0 ? (
                      <View style={styles.tagsContainer}>
                        {detectedItems.map((item, idx) => (
                          <View key={idx} style={styles.ingredientTag}>
                            <Text style={styles.tagText}>{item}</Text>
                            <TouchableOpacity onPress={() => removeIngredient(item)}>
                               <X size={12} color="#2E7D32" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View style={styles.emptyDetection}>
                        <Text style={styles.emptyText}>No ingredients detected yet. Snap a photo or add manually above.</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.listInterface}>
                <View style={styles.scannerHeader}>
                   <View style={styles.scannerTitleRow}>
                      <List size={18} color="#2E7D32" />
                      <Text style={styles.scannerTitle}>Ingredient List</Text>
                   </View>
                </View>
                <TextInput 
                  placeholder="Enter ingredients (sep. by commas)..." 
                  style={styles.listInput}
                  multiline
                  placeholderTextColor="#9CA3AF"
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={() => addIngredient(inputText)}
                />
                
                {detectedItems.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {detectedItems.map((item, idx) => (
                      <View key={idx} style={styles.ingredientTag}>
                        <Text style={styles.tagText}>{item}</Text>
                        <TouchableOpacity onPress={() => removeIngredient(item)}>
                           <X size={12} color="#2E7D32" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            <TouchableOpacity 
              style={[styles.generateBtn, (detectedItems.length === 0 && inputText === "") && styles.btnDisabled]} 
              activeOpacity={0.9}
              onPress={handleGenerate}
              disabled={detectedItems.length === 0 && inputText === ""}
            >
              <LinearGradient 
                colors={['#A5D6A7', '#81C784']} 
                start={{x: 0, y: 0}} 
                end={{x: 1, y: 0}}
                style={styles.generateBtnInner}
              >
                {isGenerating ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Text style={styles.generateBtnText}>FIND RECIPES INSTANTLY</Text>
                    <ArrowRight size={18} color="white" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {isGenerating && genStep !== "" && (
              <Text style={styles.genStepText}>{genStep}</Text>
            )}
          </View>

          <View style={styles.trustSignals}>
             <View style={styles.signal}>
                <Zap size={14} color="#2E7D32" />
                <Text style={styles.signalText}>Multimodal Recognition</Text>
             </View>
             <View style={styles.signal}>
                <Sparkles size={14} color="#2E7D32" />
                <Text style={styles.signalText}>Flavor Booster AI</Text>
             </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FFF4' },
  background: { ...StyleSheet.absoluteFillObject },
  safeArea: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingTop: 10,
    gap: 16
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1B1B1B' },
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
  scrollContent: { paddingBottom: 40, paddingTop: 20 },
  modesContainer: { paddingHorizontal: 24, gap: 10, marginBottom: 20 },
  modeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.1)',
    gap: 8,
  },
  modeBtnActive: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },
  modeLabel: { fontSize: 11, fontWeight: '900', color: '#6B7280' },
  modeLabelActive: { color: 'white' },
  
  modeDescriptionContainer: { paddingHorizontal: 24, marginBottom: 30 },
  modeDescription: { fontSize: 13, color: '#2E7D32', fontWeight: '800', textAlign: 'center', opacity: 0.7 },

  mainCard: {
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 25,
    padding: 4,
    marginBottom: 30,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 21,
    gap: 8,
  },
  toggleBtnActive: { backgroundColor: '#2E7D32' },
  toggleLabel: { fontSize: 12, fontWeight: '800', color: '#6B7280' },
  toggleLabelActive: { color: 'white' },

  scannerInterface: { gap: 16 },
  scannerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scannerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scannerTitle: { fontSize: 18, fontWeight: '900', color: '#2E7D32' },
  scannerSubtitle: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  
  scanActions: { flexDirection: 'row', gap: 8 },
  miniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  miniBtnText: { fontSize: 10, fontWeight: '700', color: '#1B1B1B' },

  detectionBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: 20,
    minHeight: 140,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  detectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  detectionTitle: { fontSize: 9, fontWeight: '900', color: '#2E7D32', opacity: 0.5, letterSpacing: 1 },
  manualAdd: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    paddingHorizontal: 12, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: 120,
  },
  manualInput: { flex: 1, height: 32, fontSize: 11, fontWeight: '600', color: '#1B1B1B' },
  
  itemsScrollContainer: { flex: 1, marginTop: 10 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  ingredientTag: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#E8F5E9', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 14, 
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.1)'
  },
  tagText: { fontSize: 11, fontWeight: '800', color: '#2E7D32' },

  emptyDetection: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  emptyText: { textAlign: 'center', color: '#6B7280', fontSize: 11, fontStyle: 'italic', lineHeight: 18, paddingHorizontal: 20 },

  listInterface: { gap: 16 },
  listInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: 20,
    height: 120,
    fontSize: 14,
    fontWeight: '500',
    color: '#1B1B1B',
    textAlignVertical: 'top',
  },

  generateBtn: { marginTop: 30, borderRadius: 25, overflow: 'hidden' },
  btnDisabled: { opacity: 0.5 },
  genStepText: { textAlign: 'center', marginTop: 12, fontSize: 11, color: '#2E7D32', fontWeight: '700', fontStyle: 'italic' },
  generateBtnInner: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  generateBtnText: { color: 'white', fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },

  trustSignals: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 30,
    opacity: 0.5,
  },
  signal: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  signalText: { fontSize: 11, fontWeight: '700', color: '#2E7D32' },
});
