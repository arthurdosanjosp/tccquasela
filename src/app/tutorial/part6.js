import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ScheduleScreen = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > -50) {
        setCurrentIndex(1);
        router.push('/tutorial/part5');
      }
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.imageContainer}>
        <Image source={require('../img/bb1.jpeg')} style={styles.topImage} />
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push('/blocos/criarblocos')}
        >
          <Ionicons name="close" size={30} color="black" /> 
        </TouchableOpacity>
      </View>

      {/* Conteúdo Principal */}
      <View style={styles.content}>
        <Text style={styles.title}>Comece a organizar os seus estudos com o</Text>
        <Text style={styles.subtitle}>SCHEDULE</Text>
        <Image source={require('../img/ss.jpeg')} style={styles.botImage} />
      </View>

      <View style={styles.indicatorContainer}>
        <View style={currentIndex === 1 ? styles.activeIndicator : styles.inactiveIndicator} />
        <View style={currentIndex === 1 ? styles.activeIndicator : styles.inactiveIndicator} />
        <View style={currentIndex === 1 ? styles.activeIndicator : styles.inactiveIndicator} />
        <View style={currentIndex === 1 ? styles.activeIndicator : styles.inactiveIndicator} />
        <View style={currentIndex === 0 ? styles.activeIndicator : styles.inactiveIndicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '100%',
    height: '40%',
    position: 'relative',
  },
  topImage: {
    width: '100%',
    height: '90%',
    position: 'absolute',
    top: '-20%',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },
  skip: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: '-40%',
  },
  title: {
    fontSize: 41,
    color: '#0066CC',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 40,
    color: '#00CCFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 1,
  },
  botImage: {
    width: 210,
    height: 210,
    marginTop: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 1,
    top: '-8%',
  },
  activeIndicator: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#0057D9',
    marginHorizontal: 5,
    top: '-18%',
  },
  inactiveIndicator: {
    width: 13,
    height: 13,
    borderRadius: 7,
    marginHorizontal: 5,
    backgroundColor: '#AAAAAA',
    top: '-18%',
  },
});

export default ScheduleScreen;
