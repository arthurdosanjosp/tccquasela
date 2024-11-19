import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importando o AsyncStorage
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';


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
    setBackgroundColor(colors[Math.floor(Math.random() * colors.length)]);
  }, [values.name]);

  useEffect(() => {
    const loadDarkMode = async () => {
      const darkModeSetting = await AsyncStorage.getItem('isDarkMode');
      if (darkModeSetting !== null) {
        setIsDarkMode(JSON.parse(darkModeSetting));
      }
    };
    loadDarkMode();
  }, []);

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
      
      // Remove todas as chaves individualmente, caso o clear não funcione
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

  const toggleDarkMode = async () => {
    const newDarkModeValue = !isDarkMode;
    setIsDarkMode(newDarkModeValue);
    await AsyncStorage.setItem('isDarkMode', JSON.stringify(newDarkModeValue));
  };

  return (
    <View style={[styles.drawer, { backgroundColor: isDarkMode ? '#333' : 'white' }]}>
      {/* Ícone de menu e alternância de modo */}
      <View style={styles.topIcons}>
        <TouchableOpacity onPress={onClose} style={styles.menuIcon}>
          <Icon name="menu" size={30} color={isDarkMode ? 'white' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleDarkMode} style={styles.modeIcon}>
          <Icon name={isDarkMode ? 'nights-stay' : 'wb-sunny'} size={30} color={isDarkMode ? 'white' : 'yellow'} />
        </TouchableOpacity>
      </View>

      {/* Cabeçalho com círculo e inicial */}
      <View style={styles.header}>
        <View style={[styles.initialCircle, { backgroundColor }]}>
          <Text style={styles.initialText}>{getInitial()}</Text>
        </View>
        <View style={styles.userInfo}>
          {isEditing.name ? (
            <TextInput
              style={styles.input}
              value={values.name}
              onChangeText={(text) => handleChange('name', text)}
              onBlur={() => toggleEdit('name')}
            />
          ) : (
            <Text style={[styles.infoValue, { color: isDarkMode ? 'white' : '#000' }]}>{values.name}</Text>
          )}
          {isEditing.email ? (
            <TextInput
              style={styles.input}
              value={values.email}
              onChangeText={(text) => handleChange('email', text)}
              onBlur={() => toggleEdit('email')}
            />
          ) : (
            <Text style={[styles.infoValue2,]}>{values.email}</Text>
          )}
        </View>
      </View>

      {/* Itens do menu */}
      <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/blocos/areadtrabalho')} style={styles.item}>
          <Icon name="work" size={25} color="#696969" />
          <Text style={[styles.itemText, { color: isDarkMode ? 'white' : 'black' }]}>Área de Trabalho</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/navbar/meusblocos')} style={styles.item}>
          <Icon name="view-quilt" size={25} color="#696969" />
          <Text style={[styles.itemText, { color: isDarkMode ? 'white' : 'black' }]}>Meus Blocos</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/navbar/favoritos')} style={styles.item}>
          <Icon name="favorite" size={25} color="#696969" />
          <Text style={[styles.itemText, { color: isDarkMode ? 'white' : 'black' }]}>Favoritos</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/navbar/configuracoes')} style={styles.item}>
          <Icon name="settings" size={25} color="#696969" />
          <Text style={[styles.itemText, { color: isDarkMode ? 'white' : 'black' }]}>Configurações</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/conta/ajuda')} style={styles.item}>
          <Icon name="help" size={25} color="#696969" />
          <Text style={[styles.itemText, { color: isDarkMode ? 'white' : 'black' }]}>Ajuda</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 40,
    zIndex: 1100,
    paddingHorizontal: 1, 
  },
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  menuIcon: {
    padding: 5,
  },
  modeIcon: {
    padding: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 10,
    marginTop: 20,
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
  },
  itemText: {
    marginLeft: 15,
    fontSize: 18,
  },
  infoValue: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  infoValue2: {
    fontSize: 12,
    color: '#87CEEB',
  },
});

export default Drawer;
