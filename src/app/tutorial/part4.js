import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder,TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const KanbanScreen = () => {
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
        router.push('/tutorial/part5');
      } else if (gestureState.dx > 50) {
        setCurrentIndex(0);
        router.push('/tutorial/part3');
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
      <Text style={styles.title}>Sugestão</Text>
      <Text style={styles.description}>
        No método Kanban de gerenciamento de tarefas, usamos as colunas de “A Fazer”, “Fazendo” e “Concluído” para termos uma melhor visualização dos conteúdos a serem realizados
      </Text>

      {/* Tarefas */}
      <View style={styles.cardContainer}>
        
        <Text style={styles.columnTitle}>Tarefas</Text>
        <View style={styles.taskCard}>
          <View style={styles.taskFooter}>
            <Text style={styles.taskText}>Mapa Mental - Revolução Francesa</Text>
            <MaterialIcons name="edit" size={20} color="#444" />
          </View>
          <Text style={styles.taskDate}>22 de Mar</Text>
        </View>
        <View style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Adicionar Ficha</Text>
        </View>
      </View>

      {/* Fazendo */}
      <View style={styles.cardContainer}>
        
        <Text style={styles.columnTitle}>Fazendo</Text>
        <View style={styles.taskCard}>
          <View style={styles.taskFooter}>
            <Text style={styles.taskText}>Exercícios - pág 110 a 111</Text>
            <MaterialIcons name="edit" size={20} color="#444" />
          </View>
          <Text style={styles.taskDate}>22 de Mar</Text>
        </View>
        <View style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Adicionar Ficha</Text>
        </View>
      </View>

      {/* Concluído */}
      <View style={styles.cardContainer}>
        <Text style={styles.columnTitle}>Concluído</Text>
        <View style={styles.taskCard}>
          <View style={styles.taskFooter}>
            <Text style={styles.taskText}>Texto - pág 108, 109</Text>
            <MaterialIcons name="edit" size={20} color="#444" />
          </View>
          <Text style={styles.taskDate}>22 de Mar</Text>
        </View>
        <View style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Adicionar Ficha</Text>
        </View>
      </View>

      <View style={styles.indicatorContainer}>
        <View style={styles.inactiveIndicator} />
        <View style={currentIndex === 1 ? styles.activeIndicator : styles.inactiveIndicator} />
        <View style={currentIndex === 0 ? styles.activeIndicator : styles.inactiveIndicator} />
        <View style={currentIndex === 1 ? styles.activeIndicator : styles.inactiveIndicator} />
        <View style={currentIndex === 1 ? styles.activeIndicator : styles.inactiveIndicator} />
      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
  },
  skip: {
    alignSelf: 'flex-end',
    color: '#AAAAAA',
    fontSize: 15,
  },
  title: {
    fontSize: 44,
    color: '#0066CC',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 7,
   
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    color: 'black',
    marginBottom: 20,
  },
  cardContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginHorizontal: 30,
    marginBottom: 30,
    elevation: 3,
  },
  columnTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4682B4',
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 7,
    borderRadius: 50,
    marginBottom: 10,
    elevation: 1,
    paddingHorizontal: 'auto',
    width: '100%',
  },
  taskText: {
    fontSize: 13,
    marginHorizontal: 10,
    color: '#333',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 1,
  },
  taskDate: {
    fontSize: 13,
    marginHorizontal: 10,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: 'center',
    width: 150,
    alignSelf: 'flex-end',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
  },
  activeIndicator: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#0057D9',
    marginHorizontal: 5,
  },
  inactiveIndicator: {
    width: 13,
    height: 13,
    borderRadius: 7,
    marginHorizontal: 5,
    backgroundColor: '#AAAAAA',
  },
});

export default KanbanScreen;
