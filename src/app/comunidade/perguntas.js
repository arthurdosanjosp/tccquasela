import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router'; 

const PerguntasFrequentes = () => {
  const router = useRouter(); 

  const perguntas = [
    { 
      pergunta: 'Como criar uma ficha?', 
      resposta: 
        '1. Crie um bloco;\n' +
        '2. Entre no bloco e crie uma coluna;\n' +
        '3. Na coluna haverá um botão escrito: "Adicionar Ficha".' 
    },
    { 
      pergunta: 'Como definir um dia de entrega em uma ficha?', 
      resposta: 
        '1. Clique na ficha;\n' +
        '2. Haverá a opção de descrição da ficha e em baixo uma opção de data.' 
    },
    { 
      pergunta: 'Como trocar imagem de perfil?', 
      resposta: 
        '1. Clique nas três linhas no canto superior esquerdo(Menu);\n' +
        '2. Clique na primeira opção, a de perfil;\n' +
        '3. Clique na "Gerenciar conta";\n' +
        '4. Entrará na página de perfil com diversas opções, entre essas na parte superior da tela terá um ícone de câmera, clique nele.\n' +
        'OU\n' +
        '1. Clique nas três linhas no canto superior esquerdo(Menu);\n' +
        '2. Clique na quinta opção, a de "configurações";\n' +
        '3. "Gerenciar Conta";\n' +
        '4. Clique no ícone da câmera.'
    },
    { 
      pergunta: 'Como alterar o meu e-mail?', 
      resposta: 
        '1. Clique nas três linhas no canto superior esquerdo(Menu);\n' +
        '2. Clique na primeira opção, a de perfil;\n' +
        '3. Entre em "Gerenciar Conta";\n' +
        '4. Ao entrar, na terceira opção estará escrito o seu "email", clique no ícone de lápis.\n' +
        'OU\n' +
        '1. Clique nas três linhas no canto superior esquerdo(Menu);\n' +
        '2. Clique na quinta opção, a de "configurações";\n' +
        '3. "Gerenciar Conta";\n' +
        '4. Clique no ícone da câmera.'
    },
    { 
      pergunta: 'Como trocar senha?', 
      resposta: 
        '1. Clique nas três linhas no canto superior esquerdo(Menu);\n' +
        '2. Clique na primeira opção, a de perfil;\n' +
        '3. Entre em "Gerenciar Conta";\n' +
        '4. Ao entrar, na quarta opção estará escrito o seu "senha", clique no ícone de lápis.\n' +
        'OU\n' +
        '1. Clique nas três linhas no canto superior esquerdo(Menu);\n' +
        '2. Clique na quinta opção, a de "configurações";\n' +
        '3. "Gerenciar Conta";\n' +
        '4. Ao entrar, na quarta opção estará escrito o seu "senha", clique no ícone de lápis.'
    },
    { 
      pergunta: 'Como criar uma coluna?', 
      resposta: 
        '1. Dentro do bloco haverá um botão de "+" no canto superior direito, ao clicar poderá criar uma coluna.' 
    },
  ];

  // Estado para controlar qual pergunta está selecionada
  const [perguntaSelecionada, setPerguntaSelecionada] = useState(null);

  // Função para alternar a exibição da resposta
  const toggleResposta = (index) => {
    if (perguntaSelecionada === index) {
      setPerguntaSelecionada(null);
    } else {
      setPerguntaSelecionada(index);
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={styles.button} onPress={() => toggleResposta(index)}>
      <Text style={styles.buttonText}>{item.pergunta}</Text>
      {perguntaSelecionada === index && (
        <Text style={styles.respostaText}>{item.resposta}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ImageBackground 
      source={require('../img/gradient (6).jpeg')} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons 
            name="arrow-back" 
            size={26} 
            color="white" 
            onPress={() => router.back()} 
          />
          <Text style={styles.title}>Perguntas frequentes</Text>
        </View>

        <View style={styles.card}>
          <ScrollView contentContainerStyle={styles.list}>
            {perguntas.map((item, index) => (
              <View key={index}>
                {renderItem({ item, index })}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    left: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
    width: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 50,
    padding: 20,
    elevation: 3, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  list: {
    paddingBottom: 16,
  },
  button: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
  },
  respostaText: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
  },
});

export default PerguntasFrequentes;
