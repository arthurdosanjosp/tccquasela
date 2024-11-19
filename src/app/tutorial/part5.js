import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder,TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Video } from 'expo-av';


export default function AreaDeTrabalho() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < -50) {
        setCurrentIndex(1);
        router.push('/tutorial/part6');
      } else if (gestureState.dx > 50) {
        setCurrentIndex(0);
        router.push('/tutorial/part4');
      }
    },
  });
  return (
    <View style={styles.container}{...panResponder.panHandlers}>
         <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => router.push('/blocos/criarblocos')} 
                >
             <Text style={styles.skip}>Pular</Text>
             </TouchableOpacity>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Área de trabalho</Text>
      </View>
      <View style={styles.optionsContainer}>
        <Text style={styles.optionsText}>
          Opções de “favoritar”, “excluir” e “ocultar”, além da criação de tarefas
        </Text>
      </View>
      <View style={styles.videoContainer}>
        <Video
          source={require('../img/2.mp4')}
          style={styles.video}
          resizeMode="cover"
          isLooping
          shouldPlay
          isMuted
        />
      </View>
      <View style={styles.indicatorContainer}>
        <View style={styles.inactiveIndicator} />
        <View style={currentIndex === 1 ? styles.activeIndicator : styles.inactiveIndicator} />
        <View style={currentIndex === 1 ? styles.activeIndicator : styles.inactiveIndicator} />
        <View style={currentIndex === 0 ? styles.activeIndicator : styles.inactiveIndicator} />
        <View style={currentIndex === 1 ? styles.activeIndicator : styles.inactiveIndicator} />
      
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  skip: {
    alignSelf: 'flex-end',
    color: '#AAAAAA',
    fontSize: 15,
  },
  headerContainer: {
    alignItems: 'center', 
    marginVertical: 10,
  },
  title: {
    fontSize: 42,
    color: '#0066CC',
    fontWeight: 'bold',
    textAlign: 'center',

  },
  optionsContainer: {
    padding: 5,
    marginTop: 10,
    borderRadius: 1,
    marginTop: 10,
  },
  optionsText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
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
  videoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 40,
    marginVertical: 70,
    overflow: 'hidden',
    top: '-6%',
  },
  video: {
    width: 300,
    height: '105%',
  },
});
