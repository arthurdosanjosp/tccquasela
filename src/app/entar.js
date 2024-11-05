import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./config/firebaseConfig";
import Icon from 'react-native-vector-icons/AntDesign';
import { useRouter } from 'expo-router';

const EntrarScreen = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const router = useRouter();

    const logar = () => {
        if (email.trim() === '' || senha.trim() === '') {
            return Alert.alert('Por favor, preencha todos os campos.');
        }

        signInWithEmailAndPassword(auth, email, senha)
            .then((userCredential) => {
                const user = userCredential.user;
                if (user.emailVerified) {
                    console.log('Usuário logado:', user);
                    setTimeout(() => {
                        router.push('/blocos/areadtrabalho');
                    }, 100); 
                } else {
                    Alert.alert('Por favor, verifique seu email antes de fazer login.');
                }
            })
            .catch((error) => {
                console.error(error);
                Alert.alert('Erro ao fazer login', error.message);
            });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={60}  // Ajuste conforme necessário
        >
            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Icon name="arrowleft" size={30} color="black" />
            </Pressable>
            <Image style={styles.imageTop} source={require('./img/bola3.jpeg')} />
            <Text style={styles.title}>Entrar</Text>
            <Text style={styles.welcomeText}>Bem-Vindo de Volta!</Text>
            <Image style={styles.imageBottom} source={require('./img/bola2.jpeg')} />

            <View style={styles.inputContainer}>
                <Icon name='mail' size={25} color='gray'/>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    onChangeText={text => setEmail(text)} 
                />
            </View>
            <View style={styles.inputContainer}>
                <Icon name='lock' size={25} color='gray'/>
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    secureTextEntry={true}
                    onChangeText={text => setSenha(text)} 
                />
            </View>

            <View style={styles.buttonContainer}>
                <Pressable onPress={logar} style={styles.button}>
                    <Text style={styles.buttonText}>ENTRAR</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 20,
        zIndex: 1,
    },
    title: {
        fontSize: 69,
        fontWeight: 'bold',
        right: 47,
        marginBottom: 10,
    },
    welcomeText: {
        fontSize: 18,
        color: 'black',
        right: 56,
        marginBottom: 260,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        height: 55,
        borderRadius: 25,
        paddingHorizontal: 10,
        marginVertical: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        color: '#000',
    },
    forgotPasswordText: {
        fontSize: 12,
        right: 117,
        color: '#0000CD',
        marginTop: 10,
        textDecorationLine: 'underline',
        marginBottom: 60,
    },
    buttonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 50,
        width: 260,
        height: 65,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    buttonText: {
        fontSize: 21,
        fontWeight: 'bold',
        color: 'black',
    },
    imageTop: {
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
        resizeMode: 'contain',
        top: -110,
        right: -219,
        bottom: '83%',
        left: 0,
        margin: 20,
    },
    imageBottom: {
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
        resizeMode: 'contain',
        bottom: -400,
        left: -80,
        right: '-6%',
        margin: 0,
    }
});

export default EntrarScreen;
