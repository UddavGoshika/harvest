import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mail, Lock, User as UserIcon, ChefHat } from 'lucide-react-native';
import { useAuth } from '../store/auth-store';

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const setUser = useAuth(state => state.setUser);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleAuth = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser = {
      email: formData.email || "chef@harvest.com",
      displayName: isLogin ? "Executive Chef" : (formData.name || "New Chef"),
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=chef",
      plan: "Free"
    };
    
    await setUser(mockUser);
    setLoading(false);
    navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F0FFF4', '#DCFCE7']}
        style={styles.background}
      />
      
      <SafeAreaView style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color="#2E7D32" size={24} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.logoIcon}>
            <ChefHat color="#white" size={32} />
          </View>
          <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Authenticate your gourmet profile.' : 'Join the elite culinary network.'}
          </Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <UserIcon size={20} color="#2E7D32" style={styles.inputIcon} />
              <TextInput 
                placeholder="Full Name"
                style={styles.input}
                value={formData.name}
                onChangeText={t => setFormData({...formData, name: t})}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Mail size={20} color="#2E7D32" style={styles.inputIcon} />
            <TextInput 
              placeholder="Email Address"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={t => setFormData({...formData, email: t})}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#2E7D32" style={styles.inputIcon} />
            <TextInput 
              placeholder="Security Key"
              style={styles.input}
              secureTextEntry
              value={formData.password}
              onChangeText={t => setFormData({...formData, password: t})}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity 
            style={styles.authButton} 
            onPress={handleAuth}
            disabled={loading}
          >
            <LinearGradient
              colors={['#2E7D32', '#66BB6A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.authButtonText}>{isLogin ? 'LOGIN' : 'REGISTER'}</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Text style={styles.toggleAccent}>{isLogin ? 'Register' : 'Login'}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  header: {
    marginTop: 30,
    alignItems: 'center',
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1B1B1B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  form: {
    marginTop: 40,
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1B1B1B',
    fontWeight: '600',
  },
  authButton: {
    height: 60,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  toggleAccent: {
    color: '#2E7D32',
    fontWeight: '800',
  },
});
