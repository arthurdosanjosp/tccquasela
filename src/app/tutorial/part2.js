import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder,TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { useRouter } from 'expo-router';

const App = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < 50) {
        if (currentIndex === 0) {
          setCurrentIndex(1);
          router.push('tutorial/part3'); 
        }
      }
    },
  });

  const pages = [0, 1, 3, 4, 5]; 

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
        <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => router.push('/blocos/criarblocos')} 
                >
      <View style={styles.header}>
        <Text style={styles.skipText}>Pular</Text>
      </View>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>Começar</Text>
        <Text style={styles.instruction}>Clique no botão “criar bloco” para{"\n"} adicionar um bloco</Text>
      </View>
      <View style={styles.videoContainer}>
        <Video
          source={require('../img/1.mp4')}
          style={styles.video}
          resizeMode="cover"
          isLooping
          shouldPlay
          isMuted
        />
      </View>
      <View style={styles.indicatorContainer}>
        {pages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex ? styles.activeIndicator : styles.inactiveIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'flex-end',
    padding: 10,
  },
  skipText: {
    color: '#AAAAAA',
    fontSize: 15,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 1,
  },
  title: {
    fontSize: 44,
    color: '#0066CC',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 22,
    color: 'black',
    textAlign: 'center',
    marginTop: 1,
  },
  videoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 1,
    marginHorizontal: 40,
    marginVertical: 70,
    overflow: 'hidden',
    top: '-6%',
  },
  video: {
    width: '100%',
    height: '103%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 1,
    top: '-8%',
  },
  indicator: {
    width: 13,
    height: 13,
    borderRadius: 7,
    marginHorizontal: 5,

  },
  activeIndicator: {
    backgroundColor: '#0057D9',
  },
  inactiveIndicator: {
    backgroundColor: '#AAAAAA',
  },
});

export default App;
