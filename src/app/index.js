import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.startButton}>
        <Text style={styles.startButtonText}>Comece já</Text>
      </View>     
      <Text style={styles.normalText}>Comece fazendo cadastro ou entrando</Text>
      <TextInput
        style={styles.textInput}
        multiline={true}
        numberOfLines={4}
      />
      
      <Image
        style={styles.image}
        source={require('./img/bola1.jpeg')}
      />
      
      <View style={styles.buttonContainer}>
        <Link href="/entar" asChild>
          <TouchableOpacity style={styles.button} onPress={() => console.log('Entrar')}>
            <Text style={styles.buttonText}>ENTRAR</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/cadastrar" asChild>
          <TouchableOpacity style={styles.button} onPress={() => console.log('Cadastrar')}>
            <Text style={styles.buttonText}>CADASTRAR</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white', 
  },
  startButton: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 5,
    width: 300,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -30, 
  },
  startButtonText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    width: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: 'black',
  },
  normalText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 300,
  },
  textInput: {
    width: 300,
    height: 150,
    padding: 10,
    textAlignVertical: 'top',
  },
  image: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: '57%',
    width: '100%',
  },
});

export default App;
