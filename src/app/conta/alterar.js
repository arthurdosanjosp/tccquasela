import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig'; 

const SwitchAccountScreen = () => {
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

  const getInitial = () => {
    return userData.name ? userData.name.charAt(0).toUpperCase() : 'U';
  };
  const handleLogout = async () => {
    try {
      await signOut(auth); 
      router.push('/cadastrar'); 
      onClose(); 
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <ImageBackground 
      source={require('../img/gradient (6).jpeg')} // Substitua pelo caminho correto da sua imagem
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="gray" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Alternar Conta</Text>
          </View>

          <Text style={styles.subheader}>Selecionar ou adicionar conta</Text>

          {/* Account Item */}
          <TouchableOpacity style={[styles.accountItem, styles.accountItemBorder]}>
            <View style={[styles.avatar, { backgroundColor: profileBgColor }]}>
              <Text style={styles.avatarText}>{getInitial()}</Text>
            </View>
            <View>
              <Text style={styles.accountName}>{userData.name}</Text>
              <Text style={styles.accountEmail}>{userData.email}</Text>
            </View>
          </TouchableOpacity>

          {/* Add Account */}
          <TouchableOpacity style={[styles.addAccountItem, styles.addAccountItemBorder]}>
            <Icon name="account-circle" size={75} color="gray" />
            <Text style={styles.addAccountText}>Adicionar conta</Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={() => router.push(handleLogout)}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ajusta a imagem para cobrir toda a tela
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -1,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'gray',
    marginLeft: 10,
  },
  subheader: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 20,
    textAlign: 'left',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    paddingBottom: 10,
  },
  accountItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 25,
    left: 5,
  },
  avatarText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  accountName: {
    fontSize: 25,
    fontWeight: '500',
    color: 'black',
  },
  accountEmail: {
    fontSize: 14,
    color: '#6699CC',
  },
  addAccountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    paddingBottom: 10,
    top: -10,
  },
  addAccountItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  addAccountText: {
    marginLeft: 15,
    fontSize: 17,
    color: 'gray',
  },
  logoutButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  logoutText: {
    color: 'red', 
  },
});

export default SwitchAccountScreen;
