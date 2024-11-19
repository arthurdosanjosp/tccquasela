import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig'; 

export default function WelcomeScreen() {
    const router = useRouter();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
      });
      const [profileBgColor, setProfileBgColor] = useState('#4B6D9B');
    
      useEffect(() => {
        const fetchUserData = async () => {
          try {
            const user = auth.currentUser;
            if (user) {
              const userDocRef = doc(db, 'usuarios', user.uid);
              const userDoc = await getDoc(userDocRef);
              if (userDoc.exists()) {
                setUserData(userDoc.data());
              }
            }
          } catch (error) {
            console.error('Erro ao recuperar dados do usuário:', error);
          }
        };
    
        fetchUserData();
    
        // Seleciona uma cor de fundo aleatória para o avatar
        const colors = ['#4B6D9B', '#80C49F', '#E8CB73', '#CD6051', '#D17BC1', '#8F5EB6', '#6DCFCF', '#ED942B'];
        setProfileBgColor(colors[Math.floor(Math.random() * colors.length)]);
      }, []);


    return (
        <View style={styles.container}>
            {/* Imagem de Boas-vindas */}
            <Image
                source={require('../img/tutorial.jpeg')} 
                style={styles.welcomeImage}
            />

            {/* Texto de Boas-vindas */}
            <Text style={styles.greetingText}>
                Olá, <Text style={styles.userName}>{userData.name}</Text>
            </Text>
            <Text style={styles.welcomeMessage}>Bem-Vindo ao Schedule!</Text>
            <Text style={styles.description}>
                Planeje e organize seus estudos {"\n"}de forma simples e eficiente.
            </Text>

            {/* Imagem de Fundo para o Botão */}
            <ImageBackground
                source={require('../img/bola1.jpeg')} 
                style={styles.buttonBackground}
                imageStyle={{ borderRadius: 1, top: -50 }} 
            >
                </ImageBackground>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => router.push('/tutorial/part2')} 
                >
                    <Text style={styles.buttonText}>IR AO TUTORIAL</Text>
                </TouchableOpacity>
          
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 10,
    },
    welcomeImage: {
        width: 190,
        height: 190,
        marginBottom: 20,
        top: '20%',
    },
    greetingText: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 12,
        top: '20%',
    },
    userName: {
        color: '#007bff', // Cor azul para o nome do usuário
    },
    welcomeMessage: {
        fontSize: 23,
        fontWeight: '500',
        color: 'black',
        textAlign: 'center',
        marginVertical: 5,
        marginBottom: 10,
        top: '20%',
    },
    description: {
        fontSize: 17,
        color: 'black',
        textAlign: 'center',
        marginVertical: 10,
        marginBottom: 20,
        top: '20%',
    },
    buttonBackground: {
        width: '111%', // Define a largura da imagem de fundo para cobrir o botão
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        height: '70%',
        top: '35%'
        
    },
    button: {
        backgroundColor: '#ffffff', // Fundo branco para o botão
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15,
        top: '-25%',
    },
    buttonText: {
        fontSize: 20,
        color: '#000000', // Texto preto
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
