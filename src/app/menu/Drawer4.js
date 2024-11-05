import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

const Drawer = ({ onClose }) => {
        const router = useRouter();
        const [values, setValues] = useState({
          name: '',
          publicName: '',
          email: '',
          senha: '',
        });
        const [isEditing, setIsEditing] = useState({
        });
        
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
    onClose(); // Fecha o menu ao navegar para outra tela
  };

  const handleGoBack = () => {
    router.back(); // Função para voltar à tela anterior
    onClose(); // Fecha o menu ao voltar para a tela anterior
  };

  return (
    <View style={styles.drawer}>
      {/* Menu de navegação com fechamento */}
      <TouchableOpacity onPress={onClose} style={styles.menuIcon}>
        <Icon name="menu" size={30} color="#000" />
      </TouchableOpacity>
      
      {/* Cabeçalho com ícone de perfil */}
      <View style={styles.header}>
        <Icon name="account-circle" size={65} color="#000" />
        <View style={styles.userInfo}>
          {isEditing.name ? (
            <TextInput
              style={styles.input}
              value={values.name}
              onChangeText={(text) => handleChange('name', text)}
              onBlur={() => toggleEdit('name')}
            />
          ) : (
            <Text style={styles.infoValue}>{values.name}</Text>
          )}
          {isEditing.email ? (
            <TextInput
              style={styles.input}
              value={values.email}
              onChangeText={(text) => handleChange('email', text)}
              onBlur={() => toggleEdit('email')}
            />
          ) : (
            <Text style={styles.infoValue}>{values.email}</Text>
          )}
        </View>
      </View>

      {/* Itens do menu */}
      <View style={styles.items}></View>
      <View style={styles.items}>
      <TouchableOpacity onPress={() => handleNavigation('/blocos/areadtrabalho')} style={styles.item}>
          <Icon name="work" size={25} color="#696969" />
          <Text style={styles.itemText}>Área de Trabalho</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/navbar/meusblocos')} style={styles.item}>
          <Icon name="view-quilt" size={25} color="#696969" />
          <Text style={styles.itemText}>Meus Blocos</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/navbar/favoritos')} style={styles.item}>
          <Icon name="favorite" size={25} color="#696969" />
          <Text style={styles.itemText}>Favoritos</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/navbar/configuracoes')} style={styles.item}>
          <Icon name="settings" size={25} color="#696969" />
          <Text style={styles.itemText}>Configurações</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.items}>
        <TouchableOpacity onPress={() => handleNavigation('/conta/ajuda')} style={styles.item}>
          <Icon name="help" size={25} color="#696969" />
          <Text style={styles.itemText}>Ajuda</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.items}>
        <TouchableOpacity onPress={onClose} style={styles.item}>
          <Icon name="exit-to-app" size={25} color="#696969" />
          <Text style={styles.itemText}>Sair</Text>
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
    width: '70%',
    height: '100%',
    backgroundColor: 'white', // Cor de fundo alterada para cinza claro
    paddingTop: 40,
    zIndex: 1000,
    paddingHorizontal: 10, // Adicionado padding horizontal para dar mais espaçamento nas laterais
  },
  menuIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1001, // Para garantir que o menu fique sobreposto
    padding: 5, // Para aumentar a área clicável do ícone
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 10,
    marginTop: 40, // Adicionado para afastar do ícone de menu
  },
  userInfo: {
    marginLeft: 15,
    justifyContent: 'center', // Centralizar o texto verticalmente
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', // Cor preta para combinar com a imagem
  },
  userEmail: {
    fontSize: 14,
    color: '#000', // Cor preta para o email
  },
  items: {
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // Linha de separação entre os itens mais discreta
    marginBottom: 20, // Espaçamento menor entre os itens
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 0, 
    top: -5
  },
  itemText: {
    marginLeft: 15, // Espaçamento aumentado entre o ícone e o texto
    fontSize: 18,
    color: '#000', // Cor preta para o texto dos itens
  },
});

export default Drawer;
