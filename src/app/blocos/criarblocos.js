import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ImageBackground, Image, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Drawer from '../menu/Drawer1';

export default function Home() {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [blockName, setBlockName] = useState('');
  const [selectedColor, setSelectedColor] = useState({ color: '', selected: false });
  const router = useRouter();

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleCreateBlock = async () => {
    if (blockName && selectedColor.color) {
        const newBlock = { id: blocks.length + 1, name: blockName, color: selectedColor.color };
        const newBlocks = [...blocks, newBlock];
        setBlocks(newBlocks);
        await saveBlocks(newBlocks);
        await AsyncStorage.setItem(`blockColor_${blockName}`, selectedColor.color); // Salva a cor do bloco

        setBlockName('');
        setSelectedColor({ color: '', selected: false });
        setModalVisible(false);
        router.push(`/blocos/areadtrabalho?blocks=${encodeURIComponent(JSON.stringify(newBlocks.map(block => ({ id: block.id, name: block.name, color: block.color }))))}`);
    }
};


  const handleColorSelect = (color) => {
    setSelectedColor({ color, selected: true });
  };

  const saveBlocks = async (newBlocks) => {
    try {
      await AsyncStorage.setItem('blocks', JSON.stringify(newBlocks));
    } catch (e) {
      console.error("Failed to save blocks.", e);
    }
  };

  const loadBlocks = async () => {
    try {
      const savedBlocks = await AsyncStorage.getItem('blocks');
      return savedBlocks ? JSON.parse(savedBlocks) : [];
    } catch (e) {
      console.error("Failed to load blocks.", e);
      return [];
    }
  };

  useEffect(() => {
    const fetchBlocks = async () => {
      const loadedBlocks = await loadBlocks();
      setBlocks(loadedBlocks);
    };

    fetchBlocks();
  }, []);

  return (
    <View>
      <ImageBackground source={require('../img/gradient.png')} style={styles.navbar}>
      <TouchableOpacity style={styles.iconButton} onPress={() => setDrawerVisible(true)}>
                        <Icon name="menu" size={40} color="#fff" />
                    </TouchableOpacity>
        <Text style={styles.title}>SCHEDULE</Text>
         <TouchableOpacity  onPress={() => router.push('/navbar/configuracoes')} style={styles.iconButton}>
          <Icon name="account-circle" size={40} color="#fff" />
        </TouchableOpacity>
      </ImageBackground>
      {isDrawerVisible && <Drawer onClose={() => setDrawerVisible(false)} />}
      <Image source={require('../img/inicio.jpeg')} style={styles.image} />
      <Text style={styles.title2}>Criar bloco</Text>
      <Text style={styles.description}> {'\n'}Crie um bloco e comece a organizar suas {'\n'}tarefas!</Text>
      <View style={styles.spacer} />
      <View style={styles.spacer} />
      <TouchableOpacity style={styles.iconContainer} onPress={handleOpenModal}>
        <Icons name='plussquare' size={85} color='#1E90FF'/>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Criar um bloco</Text>
            <View style={styles.spacer} />
            <Text style={styles.modald}>Nome do bloco</Text>
            <TextInput
              style={styles.input}
              placeholder="Escreva o nome aqui"
              value={blockName}
              onChangeText={setBlockName}
            />
            <Text style={styles.modalSubtitle}>Cor</Text>
            <Text style={styles.modald}>Selecione a cor do bloco</Text>
            <View style={styles.colorOptions}>
              <TouchableOpacity onPress={() => handleColorSelect('#4B6D9B')}>
                <View style={[styles.colorCircle, styles.blue, selectedColor.color === '#4B6D9B' && { borderWidth: 2, borderColor: 'white' }]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleColorSelect('#80C49F')}>
                <View style={[styles.colorCircle, styles.green, selectedColor.color === '#80C49F' && { borderWidth: 2, borderColor: 'white' }]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleColorSelect('#E8CB73')}>
                <View style={[styles.colorCircle, styles.yellow, selectedColor.color === '#E8CB73' && { borderWidth: 2, borderColor: 'white' }]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleColorSelect('#CD6051')}>
                <View style={[styles.colorCircle, styles.red, selectedColor.color === '#CD6051' && { borderWidth: 2, borderColor: 'white' }]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleColorSelect('#D17BC1')}>
                <View style={[styles.colorCircle, styles.pink, selectedColor.color === '#D17BC1' && { borderWidth: 2, borderColor: 'white' }]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleColorSelect('#8F5EB6')}>
                <View style={[styles.colorCircle, styles.purple, selectedColor.color === '#8F5EB6' && { borderWidth: 2, borderColor: 'white' }]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleColorSelect('#6DCFCF')}>
                <View style={[styles.colorCircle, styles.cyan, selectedColor.color === '#6DCFCF' && { borderWidth: 2, borderColor: 'white' }]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleColorSelect('#ED942B')}>
                <View style={[styles.colorCircle, styles.orange, selectedColor.color === '#ED942B' && { borderWidth: 2, borderColor: 'white' }]} />
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createButton} onPress={handleCreateBlock}>
                <Text style={styles.createButtonText}>Criar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
    height: 120,
    top: -49,
    paddingTop: StatusBar.currentHeight || 20,
  },
  iconButton: {
    padding: 10,
  },
  title: {
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
    top: -20,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  spacer: {
    height: 15,
  },
  title2: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'left',
  },
  modald: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'left',
  },
  input: {
    width: '100%',
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: 'gray',
    backgroundColor: 'white',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'left',
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  blue: {
    backgroundColor: '#4B6D9B',
  },
  green: {
    backgroundColor: '#80C49F',
  },
  yellow: {
    backgroundColor: '#E8CB73',
  },
  red: {
    backgroundColor: '#CD6051',
  },
  pink: {
    backgroundColor: '#D17BC1',
  },
  purple: {
    backgroundColor: '#8F5EB6',
  },
  cyan: {
    backgroundColor: '#6DCFCF',
  },
  orange: {
    backgroundColor: '#ED942B',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginRight: 10,
    borderColor: '#CD6051',
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: 'white',
  },
  cancelButtonText: {
    color: '#CD6051',
    fontSize: 16,
  },
  createButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#80C49F',
    backgroundColor: 'white',
  },
  createButtonText: {
    color: '#80C49F',
    fontSize: 16,
  },
});
