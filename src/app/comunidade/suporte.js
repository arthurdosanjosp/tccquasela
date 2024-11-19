import React, { useState, useEffect } from 'react';
import {
    View,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import emailjs from 'emailjs-com';

const CustomScreen = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [question, setQuestion] = useState('');
    const [description, setDescription] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const loadDarkMode = async () => {
            const darkModeSetting = await AsyncStorage.getItem('isDarkMode');
            if (darkModeSetting !== null) {
                setIsDarkMode(JSON.parse(darkModeSetting));
            }
        };
        loadDarkMode();
    }, []);

    const sendEmail = () => {
        const templateParams = {
            to_name: 'arthurbunitao444@gmail.com',
            from_name: name,
            user_email: email,
            question: question,
            description: description,
        };

        emailjs.send(
            'thur', 
            'template_l94o8k9',
            templateParams,
            '10wciDCONW4wsTXih'
        )
        .then((response) => {
            console.log('E-mail enviado com sucesso!', response.status, response.text);
            alert('E-mail enviado com sucesso!');
        })
        .catch((err) => {
            console.error('Erro ao enviar o e-mail:', err);
            alert('Erro ao enviar o e-mail.');
        });
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userDocRef = doc(db, 'usuarios', user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setName(userData.name || '');
                        setEmail(userData.email || '');
                    }
                }
            } catch (error) {
                console.error('Erro ao recuperar dados do usuário:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : 'white' }]}>
            <ImageBackground
                source={require('../img/gradient.png')}
                style={styles.navbar}
            >
                <View style={styles.navTop}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => router.back()}
                    >
                        <Icon name="arrow-back" size={35} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title1}>Suporte</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/navbar/configuracoes')}
                        style={styles.iconButton}
                    >
                        <Icon name="account-circle" size={40} color="#fff" />
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            <ScrollView contentContainerStyle={[styles.formContainer, { backgroundColor: isDarkMode ? '#333' : 'white' }]}>
            <Text style={[styles.label, { color: isDarkMode ? 'white' : 'black' }]}>
    <Text style={styles.asterisk}>*</Text> Nome
</Text>
<TextInput
    style={styles.input}
    placeholder="Nome"
    value={name}
    onChangeText={setName}
    placeholderTextColor="#888"
/>

<Text style={[styles.label, { color: isDarkMode ? 'white' : 'black' }]}>
    <Text style={styles.asterisk}>*</Text> E-mail
</Text>
<TextInput
    style={styles.input}
    placeholder="E-mail"
    value={email}
    onChangeText={setEmail}
    placeholderTextColor="#888"
    keyboardType="email-address"
/>

<Text style={[styles.label, { color: isDarkMode ? 'white' : 'black' }]}>
    <Text style={styles.asterisk}>*</Text> Pergunta
</Text>
<TextInput
    style={styles.input}
    placeholder="Pergunta"
    value={question}
    onChangeText={setQuestion}
    placeholderTextColor="#888"
/>

<Text style={[styles.label, { color: isDarkMode ? 'white' : 'black' }]}>
  <Text style={styles.asterisk}>*</Text> Descrição
</Text>
<TextInput
  style={[styles.textArea, { textAlignVertical: 'top' }]} // Garante que o texto comece do topo
  placeholder="Descrição"
  value={description}
  onChangeText={setDescription}
  placeholderTextColor="#888"
  multiline={false} // Impede múltiplas linhas
  numberOfLines={1}
  maxLength={100} // Limite de caracteres, se necessário
/>


                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton}>
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sendButton} onPress={sendEmail}>
    <Text style={styles.sendText}>Enviar</Text>
</TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    navbar: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        height: 160,
        top:-49,
        paddingTop: StatusBar.currentHeight || 20,
    },
    navTop: {
        top:30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconButton: {
        padding: 10,
    },
    title1: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    formContainer: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    asterisk: {
        color: 'red',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#f1f1f1',
    },
    textArea: {
        width: '100%',
        height: '25%',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#f1f1f1',
        marginBottom: 40,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        borderColor: '#4682B4',
        borderWidth: 1,
        borderRadius: 50,
        paddingVertical: 12,
        paddingHorizontal: 40,
    },
    cancelText: {
        color: '#4682B4',
        fontWeight: 'bold',
    },
    sendButton: {
        backgroundColor: '#4682B4',
        borderRadius: 50,
        paddingVertical: 12,
        paddingHorizontal: 40,
    },
    sendText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CustomScreen;
