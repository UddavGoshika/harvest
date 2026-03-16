import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Dimensions,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ShoppingBasket, 
  Trash2, 
  Plus, 
  Camera, 
  Calendar,
  AlertTriangle,
  ChevronRight,
  ArrowLeft
} from 'lucide-react-native';
import { useDataStore } from '../store/data-store';

const { width } = Dimensions.get('window');

export default function PantryScreen({ navigation }) {
  const { pantry, addPantryItem, removePantryItem, loadAll } = useDataStore();
  const [name, setName] = useState('');
  const [days, setDays] = useState('7');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const handleAddItem = async () => {
    if (!name) return;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + parseInt(days));
    
    const item = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      addedAt: new Date().toISOString(),
      expiryDate: expiry.toISOString(),
      quantity: "1 unit"
    };
    
    await addPantryItem(item);
    setName('');
    setDays('7');
    setIsAdding(false);
  };

  const getExpiryStatus = (date) => {
    const daysLeft = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    if (daysLeft < 0) return { label: "Expired", color: "#EF4444", progress: 1.0 };
    if (daysLeft < 3) return { label: `${daysLeft}D Left`, color: "#EF4444", progress: 0.8 };
    if (daysLeft < 7) return { label: `${daysLeft}D Left`, color: "#F59E0B", progress: 0.4 };
    return { label: `${daysLeft}D Left`, color: "#2E7D32", progress: 0.1 };
  };

  const renderItem = ({ item }) => {
    const status = getExpiryStatus(item.expiryDate);
    return (
      <View style={styles.itemCard}>
        <View style={styles.itemIcon}>
          <ShoppingBasket color="#2E7D32" size={24} />
        </View>
        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={[styles.expiryLabel, { color: status.color }]}>{status.label}</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${status.progress * 100}%`, backgroundColor: status.color }]} />
          </View>
        </View>
        <TouchableOpacity onPress={() => removePantryItem(item.id)} style={styles.deleteBtn}>
          <Trash2 color="#9CA3AF" size={18} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFFFFF', '#F0FFF4', '#DCFCE7']} style={styles.background} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft color="#1B1B1B" size={24} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>Fridge Tracker</Text>
            <Text style={styles.subtitle}>Reducing waste, one shelf at a time.</Text>
          </View>
          <TouchableOpacity style={styles.scanBtn} onPress={() => navigation.navigate('Scanner')}>
            <Camera color="white" size={24} />
          </TouchableOpacity>
        </View>

        {!isAdding ? (
          <TouchableOpacity style={styles.addTrigger} onPress={() => setIsAdding(true)}>
            <Plus color="#2E7D32" size={20} />
            <Text style={styles.addTriggerText}>TRACK NEW INGREDIENT</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.addForm}>
            <TextInput 
              placeholder="Ingredient name..."
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <View style={styles.formRow}>
              <TextInput 
                placeholder="Days until expiry"
                style={[styles.input, { flex: 1 }]}
                keyboardType="numeric"
                value={days}
                onChangeText={setDays}
              />
              <TouchableOpacity style={styles.submitBtn} onPress={handleAddItem}>
                <Text style={styles.submitBtnText}>ADD</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsAdding(false)}>
                <Text style={styles.cancelBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <FlatList 
          data={pantry}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <AlertTriangle color="#CBD5E1" size={48} />
              <Text style={styles.emptyText}>No ingredients tracked.</Text>
              <Text style={styles.emptySub}>Start by scanning your fridge.</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  background: { ...StyleSheet.absoluteFillObject },
  safeArea: { flex: 1 },
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
  headerInfo: { flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1B1B1B',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 2,
  },
  scanBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addTrigger: {
    marginHorizontal: 24,
    marginTop: 30,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(46, 125, 50, 0.1)',
    borderStyle: 'dashed',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addTriggerText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#2E7D32',
    letterSpacing: 1,
  },
  addForm: {
    marginHorizontal: 24,
    marginTop: 24,
    gap: 12,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  input: {
    height: 54,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#1B1B1B',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  submitBtn: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    justifyContent: 'center',
    borderRadius: 16,
  },
  submitBtnText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 12,
  },
  cancelBtn: {
    width: 54,
    height: 54,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  cancelBtnText: {
    color: '#6B7280',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(46, 125, 50, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
    gap: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1B1B1B',
  },
  expiryLabel: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  progressBg: {
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 10,
  },
  emptyState: {
    marginTop: 60,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1B1B1B',
    marginTop: 10,
  },
  emptySub: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  }
});
