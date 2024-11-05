import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const SwitchAccountScreen = () => {
  const router = useRouter();

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
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>H</Text>
            </View>
            <View>
              <Text style={styles.accountName}>Helena</Text>
              <Text style={styles.accountEmail}>helenasilva@gmail.com</Text>
            </View>
          </TouchableOpacity>

          {/* Add Account */}
          <TouchableOpacity style={[styles.addAccountItem, styles.addAccountItemBorder]}>
            <Icon name="account-circle" size={75} color="gray" />
            <Text style={styles.addAccountText}>Adicionar conta</Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton}>
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
    textAlign: 'left', // Adicionado para alinhar à esquerda
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    paddingBottom: 10, // Adicionado para dar espaço para a borda
  },
  accountItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 50,
    backgroundColor: '#6699CC',
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
    top: -10 // Adicionado para dar espaço para a borda
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
    marginTop: 30,
    alignSelf: 'center', // Centraliza o botão "Sair"
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    top: -15
  },
});

export default SwitchAccountScreen;
