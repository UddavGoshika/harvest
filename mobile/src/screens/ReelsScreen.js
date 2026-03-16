import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Dimensions, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Play, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const REELS = [
  { id: 1, author: "@chef_sophie", title: "Midnight Pasta Hack", likes: "12.4k", imageUrl: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=800" },
  { id: 2, author: "@healthy_bites", title: "Expiring Spinach? Do this!", likes: "8.1k", imageUrl: "https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=800" },
  { id: 3, author: "@global_eats", title: "Real Thai Green Curry", likes: "25k", imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=800" },
  { id: 4, author: "@street_foodie", title: "Mumbai Style Pav Bhaji", likes: "18.2k", imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800" },
];

const SocialIcon = ({ icon: Icon, label }) => (
  <View style={styles.socialIconContainer}>
    <TouchableOpacity style={styles.socialButton}>
      <Icon size={24} color="white" />
    </TouchableOpacity>
    <Text style={styles.socialLabel}>{label}</Text>
  </View>
);

export default function ReelsScreen() {
  const [activeIdx, setActiveIdx] = useState(0);

  const nextReel = () => {
    if (activeIdx < REELS.length - 1) setActiveIdx(activeIdx + 1);
  };

  const prevReel = () => {
    if (activeIdx > 0) setActiveIdx(activeIdx - 1);
  };

  const reel = REELS[activeIdx];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image source={{ uri: reel.imageUrl }} style={styles.backgroundVideoPlaceholder} />
      
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
        style={styles.overlay}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.centerPlay}>
            <Play size={80} color="rgba(255,255,255,0.2)" />
            <Text style={styles.reelTitle}>{reel.title}</Text>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.authorRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{reel.author[1].toUpperCase()}</Text>
              </View>
              <View>
                <Text style={styles.authorText}>{reel.author}</Text>
                <Text style={styles.recommendedText}>Recommended for you</Text>
              </View>
              <TouchableOpacity style={styles.followBtn}>
                <Text style={styles.followBtnText}>Follow</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.socialRow}>
              <SocialIcon icon={Heart} label={reel.likes} />
              <SocialIcon icon={MessageCircle} label="244" />
              <SocialIcon icon={Share2} label="Share" />
            </View>
          </View>
        </View>

        <View style={styles.sideControls}>
          <TouchableOpacity 
            style={[styles.navBtn, activeIdx === 0 && styles.disabledBtn]} 
            onPress={prevReel}
            disabled={activeIdx === 0}
          >
            <ChevronUp size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navBtn, activeIdx === REELS.length - 1 && styles.disabledBtn]} 
            onPress={nextReel}
            disabled={activeIdx === REELS.length - 1}
          >
            <ChevronDown size={32} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backgroundVideoPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
    opacity: 0.8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  centerPlay: {
    alignItems: 'center',
    gap: 20,
    marginTop: -100,
  },
  reelTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    paddingHorizontal: 40,
    letterSpacing: -0.5,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    gap: 30,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#66BB6A',
  },
  avatarText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 18,
  },
  authorText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 16,
  },
  recommendedText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '600',
  },
  followBtn: {
    marginLeft: 'auto',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  followBtnText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '900',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 24,
  },
  socialIconContainer: {
    alignItems: 'center',
    gap: 6,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialLabel: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sideControls: {
    position: 'absolute',
    right: 20,
    top: height / 2 - 60,
    gap: 20,
  },
  navBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.3,
  }
});
