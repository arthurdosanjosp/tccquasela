import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Para o ícone de seta
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function AjudaScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter(); 
  
  useEffect(() => {
    // Carrega a preferência do modo escuro
    const loadDarkMode = async () => {
        const darkModeSetting = await AsyncStorage.getItem('isDarkMode');
        if (darkModeSetting !== null) {
            setIsDarkMode(JSON.parse(darkModeSetting));
        }
    };
    loadDarkMode();
}, []);

  return (
    <ImageBackground 
      source={require('../img/gradient (6).jpeg')} // Substitua pelo caminho correto da sua imagem
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Ajuda</Text>
        </View>
        
        <View style={[styles.content, { backgroundColor: isDarkMode ? '#333' : 'white' }]}>
    <View style={styles.section}>
        <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>Perguntas frequentes</Text>
        <Text style={[styles.subtitle, { color: isDarkMode ? 'lightgray' : 'gray' }]}>Perguntas mais frequentes feitas por usuários</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/comunidade/perguntas')}>
            <Text style={styles.buttonText}>Visualizar</Text>
        </TouchableOpacity>
    </View>

    <View style={styles.section}>
        <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>Comunidade</Text>
        <Text style={[styles.subtitle, { color: isDarkMode ? 'lightgray' : 'gray' }]}>Perguntas e respostas feitas pelos usuários</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/comunidade/comunidade')}>
            <Text style={styles.buttonText}>Visualizar</Text>
        </TouchableOpacity>
    </View>

    <View style={styles.section}>
        <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>Suporte</Text>
        <Text style={[styles.subtitle, { color: isDarkMode ? 'lightgray' : 'gray' }]}>Algum problema? Nos contate!</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/comunidade/suporte')}>
            <Text style={styles.buttonText}>Visualizar</Text>
        </TouchableOpacity>
    </View>

    <View style={styles.section}>
        <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>Tutorial</Text>
        <Text style={[styles.subtitle, { color: isDarkMode ? 'lightgray' : 'gray' }]}>Um tutorial completo e prático.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/tutorial/part2')}>
            <Text style={styles.buttonText}>Visualizar</Text>
        </TouchableOpacity>
    </View>
</View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    top: 30, // Posição fixa para o header
    left: 1,
  },
  headerText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 1,
    padding: 30,
    alignItems: 'flex-start', 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  section: {
    marginBottom: 14,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left', 
  },
  subtitle: {
    fontSize: 13,
    color: '#6e6e6e',
    marginBottom: 8,
    textAlign: 'left', 
  },
  button: {
    backgroundColor: '#4682B4',
    padding: 8,
    borderRadius: 60,
    alignItems: 'center', 
    alignSelf: 'center', 
    width: '40%',
    right: 100, 
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
