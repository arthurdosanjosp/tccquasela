import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const [values, setValues] = useState({
    name: '',
    email: '',
    senha: '',
  });
  const [isEditing, setIsEditing] = useState({});
  const [bgColor, setBgColor] = useState('#4B6D9B');
  const [showPassword, setShowPassword] = useState(false);

  const colors = ['#4B6D9B', '#80C49F', '#E8CB73', '#CD6051', '#D17BC1', '#8F5EB6', '#6DCFCF', '#ED942B'];

  
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
    // Define uma cor aleatória
    setBgColor(colors[Math.floor(Math.random() * colors.length)]);
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

  const updateUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'usuarios', user.uid); 
        await updateDoc(userDocRef, {
          name: values.name,
          email: values.email,
          password: values.senha, 
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };
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
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : 'white' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
        <Icon name="arrow-back" size={32} color={isDarkMode ? 'white' : '#000'} />

        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDarkMode ? 'white' : 'black' }]}>Gerenciar Conta</Text>

      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={[styles.avatarContainer, { backgroundColor: bgColor }]}>
          <Text style={styles.avatarText}>
            {values.name ? values.name.charAt(0).toUpperCase() : ''}
          </Text>
      
       
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{values.name}</Text>
          <Text style={styles.userEmail}>{values.email}</Text>
        </View>
      </View>

      {/* Informações */}
      <Text style={[styles.sectionTitle, { color: isDarkMode ? 'white' : 'black' }]}>Informações</Text>

      <View style={styles.section}>
        {/* Nome Completo */}
        <View style={styles.infoRow}>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Nome Público</Text>
            {isEditing.name ? (
              <TextInput
                style={styles.input}
                value={values.name}
                onChangeText={(text) => handleChange('name', text)}
                onBlur={() => {
                  toggleEdit('name');
                  updateUserData();
                }}
              />
            ) : (
              <Text style={styles.infoValue}>{values.name}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => toggleEdit('name')}>
            <Icon name="edit" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        {/* Nome Completo */}
        <View style={styles.infoRow}>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Nome Completo</Text>
            {isEditing.name ? (
              <TextInput
                style={styles.input}
                value={values.name}
                onChangeText={(text) => handleChange('name', text)}
                onBlur={() => {
                  toggleEdit('name');
                  updateUserData();
                }}
              />
            ) : (
              <Text style={styles.infoValue}>{values.name}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => toggleEdit('name')}>
            <Icon name="edit" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Email */}
        <View style={styles.infoRow}>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Email</Text>
            {isEditing.email ? (
              <TextInput
                style={styles.input}
                value={values.email}
                onChangeText={(text) => handleChange('email', text)}
                onBlur={() => {
                  toggleEdit('email');
                  updateUserData();
                }}
              />
            ) : (
              <Text style={styles.infoValue}>{values.email}</Text>
            )}
          </View>
      
        </View>

        {/* Senha */}
        <View style={styles.infoRow}>
  <View style={styles.infoTextContainer}>
    <Text style={styles.infoLabel}>Senha</Text>
    <TextInput
      style={styles.input}
      value={values.senha}
      secureTextEntry={!showPassword}
      editable={false} // Torna o campo de senha não editável
    />
  </View>
  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
    <Icon
      name={showPassword ? 'visibility' : 'visibility-off'}
      size={24}
      color="#000"
    />
  </TouchableOpacity>
</View>

        
        </View>
      </View>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 15,
    top: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d0e0f0',
    padding: 20,
    height: 120,
    borderRadius: 1,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userDetails: {
    marginLeft: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#4f7bbd',
    marginTop: 4,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 4,
  },
  section: {
    backgroundColor: '#f4f4f4',
    padding: 20,
    borderRadius: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    color: '#555',
    fontSize: 16,
    marginBottom: 10,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 18,
    paddingVertical: 4,
  },
});

export default AccountScreen;
