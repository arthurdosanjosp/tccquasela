import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, StatusBar, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router'; 
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig'; 
import { signOut } from 'firebase/auth'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Config() {
    const router = useRouter();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
    });
    const [profileBgColor, setProfileBgColor] = useState('#4B6D9B');
    const [isDarkMode, setIsDarkMode] = useState(false);

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

        // Seleciona uma cor de fundo aleatória para o círculo
        const colors = ['#4B6D9B', '#80C49F', '#E8CB73', '#CD6051', '#D17BC1', '#8F5EB6', '#6DCFCF', '#ED942B'];
        setProfileBgColor(colors[Math.floor(Math.random() * colors.length)]);
    }, []);

    const getInitial = () => {
        return userData.name ? userData.name.charAt(0).toUpperCase() : 'U';
    };
    
    const handleLogout = async () => {
        try {
         
          const keys = await AsyncStorage.getAllKeys();
          
          
          if (keys.length > 0) {
            await AsyncStorage.multiRemove(keys);
          }
      
          await signOut(auth);
          
          router.push('/cadastrar');
          onClose(); 
        } catch (error) {
          console.error('Erro ao fazer logout e limpar armazenamento:', error);
        }
      };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : 'white' }]}> 
        <ImageBackground source={require('../img/gradient.png')} style={styles.navbar}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                <Icon name="arrow-back" size={40} color="#fff" />
            </TouchableOpacity>
            <Text style={[styles.title]}>Configurações</Text>
        </ImageBackground>
    
        <View style={styles.profileContainer}>
            <View style={[styles.profileIcon, { backgroundColor: profileBgColor }]}>
                <Text style={styles.profileInitial }>{getInitial()}</Text>
            </View>
            <View style={styles.profileDetails}>
                <Text style={[styles.profileName, { color: isDarkMode ? 'white' : 'black' }]}>{userData.name || 'Nome Completo'}</Text>
                <Text style={[styles.profileEmail, { color: isDarkMode ? 'gray' : 'gray' }]}>{userData.email || 'Email'}</Text>
                <TouchableOpacity onPress={() => router.push('/conta/gerenciar')}>
                    <Text style={[styles.editText]}>Editar</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.optionsContainer}>
    <TouchableOpacity style={styles.optionItem} onPress={() => router.push('/conta/alterar')}>  
        <Icon name="sync-alt" size={40} color={isDarkMode ? 'white' : '#424242'} />
        <Text style={[styles.optionText, { color: isDarkMode ? 'white' : 'black' }]}>Alternar conta</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.optionItem} onPress={() => router.push('/conta/gerenciar')}>
        <Icon name="manage-accounts" size={40} color={isDarkMode ? 'white' : '#424242'} />
        <Text style={[styles.optionText, { color: isDarkMode ? 'white' : 'black' }]}>Gerenciar conta</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.optionItem} onPress={() => router.push('/conta/ajuda')}>
        <Icon name="help-outline" size={40} color={isDarkMode ? 'white' : '#424242'} />
        <Text style={[styles.optionText, { color: isDarkMode ? 'white' : 'black' }]}>Ajuda</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.optionItem} onPress={() => BackHandler.exitApp()}>
        <Icon name="logout" size={40} color={isDarkMode ? 'white' : '#424242'} />
        <Text style={[styles.optionText, { color: isDarkMode ? 'white' : 'black' }]}>Sair</Text>
    </TouchableOpacity>
</View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15,
        height: 170,
        top: -49,
        paddingTop: StatusBar.currentHeight || 20,
    },
    iconButton: {
        padding: 10,
    },
    title: {
        fontSize: 30,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        paddingHorizontal: 15,
        top: -15,
    },
    profileIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileInitial: {
        fontSize: 50,
        color: '#fff',
        fontWeight: 'bold',
    },
    profileDetails: {
        marginLeft: 15,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    profileEmail: {
        fontSize: 16,
        color: '#616161',
        marginVertical: 2,
    },
    editText: {
        fontSize: 14,
        color: '#1e88e5',
        marginTop: 5,
    },
    optionsContainer: {
        marginTop: 1,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingHorizontal: 20,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    optionText: {
        fontSize: 22,
        marginLeft: 20,
        color: '#424242',
    },
});
