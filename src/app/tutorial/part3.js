import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder,TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { useRouter } from 'expo-router';

export default function CriarColunaScreen() {
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
        router.push('/tutorial/part4');
      } else if (gestureState.dx > 50) {
        setCurrentIndex(0);
        router.push('/tutorial/part2');
      }
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
        <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => router.push('/blocos/criarblocos')} 
                >
             <Text style={styles.skip}>Pular</Text>
             </TouchableOpacity>
      <Text style={styles.title}>Criar Coluna</Text>
      <View style={styles.box}>
        <Text style={styles.text}>
          Clique no ícone "+" para criar uma coluna e em "Adicionar ficha" para adicionar uma{"\n"} ficha
        </Text>
      </View>
      <View style={styles.videoContainer}>
        <Video
          source={require('../img/3.mp4')}
          style={styles.video}
          resizeMode="cover"
          isLooping
          shouldPlay
          isMuted
        />
      </View>
      <View style={styles.indicatorContainer}>
        <View style={currentIndex === 1 ? styles.activeIndicator : styles.inactiveIndicator} />
        <View style={currentIndex === 0 ? styles.activeIndicator : styles.inactiveIndicator} />
        <View style={currentIndex === 1 ? styles.activeIndicator : styles.inactiveIndicator} />
        <View style={currentIndex === 1 ? styles.activeIndicator : styles.inactiveIndicator} />
        <View style={currentIndex === 1 ? styles.activeIndicator : styles.inactiveIndicator} />
       
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  skip: {
    alignSelf: 'flex-end',
    color: '#AAAAAA',
    fontSize: 15,
    marginLeft: '85%', 
  },
  title: {
    fontSize: 44,
    color: '#0066CC',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  box: {
   
    padding: 5,
    marginTop: 10,
    borderRadius: 1,
    maxWidth: '90%',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
 

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
    top: '-5%',
  },
  video: {
    width: 300,
    height: '110%',
  },
  
});
