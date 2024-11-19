import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colors = ['#4B6D9B', '#80C49F', '#E8CB73', '#CD6051', '#D17BC1', '#8F5EB6', '#6DCFCF', '#ED942B'];

const Drawer = ({ onClose }) => {
  const router = useRouter();
  const [values, setValues] = useState({
    name: '',
    publicName: '',
    email: '',
    senha: '',
  });
  const [isEditing, setIsEditing] = useState({});
  const [backgroundColor, setBackgroundColor] = useState(colors[0]);
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
            setValues(userDoc.data());
          }
        }
      } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Define uma cor aleatória ao carregar o componente ou quando o nome do usuário mudar
    setBackgroundColor(colors[Math.floor(Math.random() * colors.length)]);
  }, [values.name]);

  const toggleEdit = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (field, text) => {
    setValues((prev) => ({
      ...prev,
      [field]: text,
    }));
  };

  const handleNavigation = (path) => {
    router.push(path);
    onClose(); 
  };

  const handleGoBack = () => {
    router.back();
    onClose();
  };

  const handleLogout = async () => {
    try {
      // Busca todas as chaves no AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      
      
      if (keys.length > 0) {
        await AsyncStorage.multiRemove(keys);
      }
      
      // Realiza o logout no Firebase
      await signOut(auth);
      
      // Redireciona para a tela de cadastro após logout e limpeza do AsyncStorage
      router.push('/cadastrar');
      onClose(); 
    } catch (error) {
      console.error('Erro ao fazer logout e limpar armazenamento:', error);
    }
  };

  const getInitial = () => {
    return values.name ? values.name.charAt(0).toUpperCase() : '';
  };

  return (
    <View style={[styles.drawer]}>
    {/* Menu de navegação com fechamento */}
    <TouchableOpacity onPress={onClose} style={styles.menuIcon}>
        <Icon name="menu" size={30} color={isDarkMode ? 'white' : '#000'} />
    </TouchableOpacity>

    {/* Cabeçalho com círculo e inicial */}
    <View style={styles.header}>
        <View style={[styles.initialCircle, { backgroundColor }]}>
            <Text style={[styles.initialText, { color: isDarkMode ? 'white' : 'black' }]}>{getInitial()}</Text>
        </View>
        <View style={styles.userInfo}>
            {isEditing.name ? (
                <TextInput
                    style={[styles.input, { color: isDarkMode ? 'white' : 'black' }]}
                    value={values.name}
                    onChangeText={(text) => handleChange('name', text)}
                    onBlur={() => toggleEdit('name')}
                />
            ) : (
                <Text style={[styles.infoValue, { color: isDarkMode ? 'white' : 'black' }]}>{values.name}</Text>
            )}
            {isEditing.email ? (
                <TextInput
                    style={[styles.input, { color: isDarkMode ? 'white' : 'black' }]}
                    value={values.email}
                    onChangeText={(text) => handleChange('email', text)}
                    onBlur={() => toggleEdit('email')}
                />
            ) : (
              <Text style={[styles.infoValue2, { color: isDarkMode ? '#87CEEB' : '#87CEEB' }]}>{values.email}</Text>
            )}
        </View>
    </View>

    {/* Itens do menu */}
    <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/blocos/areadtrabalho')} style={styles.item}>
            <Icon name="work" size={25} color={isDarkMode ? 'white' : '#696969'} />
            <Text style={[styles.itemText, { color: isDarkMode ? 'white' : 'black' }]}>Área de Trabalho</Text>
        </TouchableOpacity>
    </View>
    <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/navbar/meusblocos')} style={styles.item}>
            <Icon name="view-quilt" size={25} color={isDarkMode ? 'white' : '#696969'} />
            <Text style={[styles.itemText, { color: isDarkMode ? 'white' : 'black' }]}>Meus Blocos</Text>
        </TouchableOpacity>
    </View>
    <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/navbar/favoritos')} style={styles.item}>
            <Icon name="favorite" size={25} color={isDarkMode ? 'white' : '#696969'} />
            <Text style={[styles.itemText, { color: isDarkMode ? 'white' : 'black' }]}>Favoritos</Text>
        </TouchableOpacity>
    </View>
    <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/navbar/configuracoes')} style={styles.item}>
            <Icon name="settings" size={25} color={isDarkMode ? 'white' : '#696969'} />
            <Text style={[styles.itemText, { color: isDarkMode ? 'white' : 'black' }]}>Configurações</Text>
        </TouchableOpacity>
    </View>
    <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/conta/ajuda')} style={styles.item}>
            <Icon name="help" size={25} color={isDarkMode ? 'white' : '#696969'} />
            <Text style={[styles.itemText, { color: isDarkMode ? 'white' : 'black' }]}>Ajuda</Text>
        </TouchableOpacity>
    </View>

    {/* Adicionando o botão de Logout */}
    <View style={styles.items}>
    <TouchableOpacity style={styles.item} onPress={() => BackHandler.exitApp()}>
  <Icon name="exit-to-app" size={25} color="#696969" />
  <Text style={[styles.itemText, { color: isDarkMode ? 'white' : 'black' }]}>Sair</Text>
</TouchableOpacity>
    </View>
</View>

  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '80%',
    height: '100%',
    backgroundColor: 'white',
    paddingTop: 40,
    zIndex: 1100,
    paddingHorizontal: 1, 
  },
  menuIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1001, 
    padding: 5, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 10,
    marginTop: 40,
  },
  initialCircle: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    fontSize: 30,
    color: '#FFF',
    fontWeight: 'bold',
  },
  userInfo: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  userEmail: {
    fontSize: 14,
    color: '#000',
  },
  items: {
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 0,
    top: -5,
  },
  itemText: {
    marginLeft: 15,
    fontSize: 18,
    color: '#000',
  },
  infoValue: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000',
  },
  infoValue2: {
    fontSize: 12,
    color: '#87CEEB',
  },
});
export default Drawer;
