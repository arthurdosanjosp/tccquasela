import React, { useState, useEffect } from 'react';
import { View, ImageBackground, TouchableOpacity, TextInput, StyleSheet, Text, FlatList, StatusBar, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Drawer from '../menu/Drawer2';
import { useRouter } from 'expo-router';


const ScheduleHeader = () => {
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [colunas, setColunas] = useState([]);
    const [checkedBlocks, setCheckedBlocks] = useState([]);
    const [favoritedBlocks, setFavoritedBlocks] = useState([]);
    const [hiddenBlocks, setHiddenBlocks] = useState([]);
    const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
    const [blockToDeleteId, setBlockToDeleteId] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const router = useRouter();

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
        const loadBlocks = async () => {
            try {
                const savedBlocks = await AsyncStorage.getItem('blocks');
                if (savedBlocks !== null) {
                    setData(JSON.parse(savedBlocks));
                }
            } catch (error) {
                console.error('Falha ao carregar blocos', error);
            }
        };

        const loadColunas = async () => {
            try {
                const savedColunas = await AsyncStorage.getItem('colunas');
                if (savedColunas !== null) {
                    setColunas(JSON.parse(savedColunas));
                }
            } catch (error) {
                console.error('Falha ao carregar colunas', error);
            }
        };

        const loadCheckedBlocks = async () => {
            try {
                const savedCheckedBlocks = await AsyncStorage.getItem('checkedBlocks');
                if (savedCheckedBlocks !== null) {
                    setCheckedBlocks(JSON.parse(savedCheckedBlocks));
                }
            } catch (error) {
                console.error('Falha ao carregar blocos checados', error);
            }
        };

        const loadFavoritedBlocks = async () => {
            try {
                const savedFavoritedBlocks = await AsyncStorage.getItem('favoritedBlocks');
                if (savedFavoritedBlocks !== null) {
                    setFavoritedBlocks(JSON.parse(savedFavoritedBlocks));
                }
            } catch (error) {
                console.error('Falha ao carregar blocos favoritados', error);
            }
        };

        loadBlocks();
        loadColunas();
        loadCheckedBlocks();
        loadFavoritedBlocks();
    }, []);

    useEffect(() => {
        const filterData = () => {
            const filtered = data.filter(block => block.name.toLowerCase().includes(searchText.toLowerCase()));
            setFilteredData(filtered);
        };

        filterData();
    }, [searchText, data]);
    useEffect(() => {
        const loadHiddenBlocks = async () => {
            try {
                const savedHiddenBlocks = await AsyncStorage.getItem('hiddenBlocks');
                if (savedHiddenBlocks !== null) {
                    setHiddenBlocks(JSON.parse(savedHiddenBlocks));
                }
            } catch (error) {
                console.error('Falha ao carregar blocos ocultos', error);
            }
        };

        loadHiddenBlocks();
    }, []);
    const handleVisibilityToggle = async (id) => {
        setHiddenBlocks(prevState => {
            const isHidden = prevState.includes(id);
            const newHiddenBlocks = isHidden
                ? prevState.filter(blockId => blockId !== id)
                : [...prevState, id];
            AsyncStorage.setItem('hiddenBlocks', JSON.stringify(newHiddenBlocks));
            return newHiddenBlocks;
        });
    };

    const handleSearchTextChange = (text) => {
        setSearchText(text);
    };

    const handleToggleCheckBlock = async (id) => {
        setCheckedBlocks(prevCheckedBlocks => {
            const newCheckedBlocks = prevCheckedBlocks.includes(id)
                ? prevCheckedBlocks.filter(blockId => blockId !== id)
                : [...prevCheckedBlocks, id];
            AsyncStorage.setItem('checkedBlocks', JSON.stringify(newCheckedBlocks));
            return newCheckedBlocks;
        });
    };

    const toggleFavorite = async (id) => {
        setFavoritedBlocks(prevState => {
            const newState = prevState.includes(id)
                ? prevState.filter(favoriteId => favoriteId !== id)
                : [...prevState, id];
            AsyncStorage.setItem('favoritedBlocks', JSON.stringify(newState));
            return newState;
        });
    };
    const handleDeleteBlock = (id) => {
        setBlockToDeleteId(id);
        setConfirmDeleteModalVisible(true);
    };

    const handleDeleteConfirmed = async () => {
        const blockToDelete = data.find(block => block.id === blockToDeleteId);
        if (!blockToDelete) return;
    
        const updatedData = data.filter(block => block.id !== blockToDeleteId);
        setData(updatedData);
        setConfirmDeleteModalVisible(false);
    
        const updatedColunas = colunas.map(coluna => {
            const updatedFichas = coluna.fichas.filter(ficha => ficha.nome !== blockToDelete.name);
            return { ...coluna, fichas: updatedFichas };
        });
        setColunas(updatedColunas);
    
        // Salvar os blocos atualizados no AsyncStorage
        try {
            await AsyncStorage.setItem('blocks', JSON.stringify(updatedData));
        } catch (error) {
            console.error('Falha ao salvar blocos após exclusão', error);
        }
    };


    const renderItem = ({ item }) => (
        <View style={[styles.block, { backgroundColor: item.color }]}>
            <Text style={styles.blockText}>{item.name}</Text>
            <View style={styles.blockFooter}>
                <TouchableOpacity
                    style={styles.iconTouchable}
                    onPress={() => toggleFavorite(item.id)}
                >
                    <Icon name="favorite" size={20} color={favoritedBlocks.includes(item.id) ? "red" : "#fff"} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconTouchable}
                    onPress={() => handleVisibilityToggle(item.id)}
                >
                    <Icon name={hiddenBlocks.includes(item.id) ? "visibility-off" : "visibility"} size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconTouchable} onPress={() => handleDeleteBlock(item.id)}>
                    <Icon name="delete" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderFichaItem = (ficha) => (
        <View key={ficha.id} style={styles.fichaContainer} onPress={() => handleOpenFichaModal(ficha)}>
            <View style={styles.ficha}>
                <View style={styles.iconContainer}>
                    <View style={[styles.circleIcon, { backgroundColor: '#4B6D9B' }]} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.tarefaText}>{ficha.nome}</Text>
                    <Text style={styles.tarefaDescription}>{ficha.description}</Text>
                    <View style={styles.dateContainer}>
                        <Icon name="schedule" size={12} color="#888" style={{ marginRight: 5 }} />
                        <Text style={styles.tarefaDate}>{ficha.date}</Text>
                    </View>
                </View>
                <View style={styles.checkboxContainer}>
                    <TouchableOpacity onPress={() => handleToggleCheckBlock(ficha.id)}>
                        <Icon name="check-box" size={24} color={checkedBlocks.includes(ficha.id) ? "green" : "#888"} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    );

    return (
        <View style={{ flex: 1, backgroundColor: isDarkMode ? '#333' : 'white' }}>
        <ImageBackground source={require('../img/gradient.png')} style={styles.navbar}>
            <View style={styles.navTop}>
                <TouchableOpacity style={styles.iconButton} onPress={() => setDrawerVisible(true)}>
                    <Icon name="menu" size={40} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title1}>SCHEDULE</Text>
                <TouchableOpacity onPress={() => router.push('/navbar/configuracoes')} style={styles.iconButton}>
                    <Icon name="account-circle" size={40} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Pesquisar"
                    placeholderTextColor="#888"
                    value={searchText}
                    onChangeText={handleSearchTextChange}
                />
                <Icon name="search" size={24} color="#888" style={styles.searchIcon} />
            </View>
        </ImageBackground>
            {isDrawerVisible && <Drawer onClose={() => setDrawerVisible(false)} />}
           
            <View style={styles.contentContainer}>
                <Text style={styles.title2}>Meus Blocos</Text>
                <Text style={[styles.subtitle, { color: isDarkMode ? 'white' : 'black' }]}>Todos os blocos</Text>

                <FlatList
                    data={filteredData}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatlistContainer}
                />
                </View>
                {isDrawerVisible && <Drawer onClose={() => setDrawerVisible(false)} />}
                <View style={styles.taskFilterContainer}>
                    <View style={styles.taskFilterTitleContainer}>
                    <Text style={[styles.taskFilterTitle, { color: isDarkMode ? 'white' : 'black' }]}>Tarefas feitas</Text>
                    </View>
                    <ScrollView style={styles.scrollContainer}>
                        <View style={styles.colunasContainer}>
                            {colunas.map((coluna, index) => (
                                <View key={index} style={styles.tarefasContainer}>
                                    {coluna.fichas && coluna.fichas.filter(ficha => checkedBlocks.includes(ficha.id)).map((ficha, fichaIndex) => (
                                        renderFichaItem(ficha)
                                    ))}
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                    

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={confirmDeleteModalVisible}
                        onRequestClose={() => setConfirmDeleteModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
                                <Text style={styles.modald}>Deseja realmente excluir este bloco?</Text>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.cancelButton} onPress={() => setConfirmDeleteModalVisible(false)}>
                                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.createButton, { backgroundColor: 'white' }]} onPress={handleDeleteConfirmed}>
                                        <Text style={styles.createButtonText}>Excluir</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
           
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 15,
        height: 210,
        top: -49,
        paddingTop: StatusBar.currentHeight || 20,
    },
    scrollContainer: {
        height: 400, // ajusta a altura conforme necessário
    },
    navTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 100,
    },
    iconButton: {
        padding: 10,
    },
    title1: {
        fontSize: 25,
        color: 'white',
        fontWeight: 'bold',
    },
    searchContainer: {
        width: '100%',
        paddingHorizontal: 10,
        marginTop: 10,
        position: 'relative',
    },
    searchBar: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 40,
        backgroundColor: '#fff',
        width: '100%',
    },
    searchIcon: {
        position: 'absolute',
        right: 20,
        top: 8,
    },
    highlightedBlock: {
        borderColor: 'blue',
        borderWidth: 2,
    },
    contentContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        top: -30
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title2: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E90FF',
        textAlign: 'left',


    },
    addIcon: {
        padding: 10,
    },
    subtitle: {
        fontSize: 14,
        color: 'black',
        marginBottom: 20,
    },
    flatlistContainer: {
        flexGrow: 1,
        top: 3,
        justifyContent: 'start',
    },
    block: {
        width: 140,
        padding: 20,
        borderRadius: 20,
        marginBottom: 10,
        marginHorizontal: 10,
        height: 130,
        justifyContent: 'space-between',
    },
    blockFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10,
    },
    iconTouchable: {
        marginHorizontal: 3,
    },
    blockText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#fff',
    },
    taskFilterContainer: {
        marginTop: 5,
        paddingHorizontal: 20,
    },
    taskFilterTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskFilterTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
        left: 5,
        marginBottom: 20,
    },
    taskFilterButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    taskFilterButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    taskFilterButtonText: {
        fontSize: 16,
        color: '#888',
        top: -10,
    },
    addTaskIcon: {
        paddingVertical: 10,
        paddingHorizontal: -10,
        left: 10,
    },
    tarefaText: {
        fontSize: 18,
    },
    tarefaDate: {
        fontSize: 11,
        color: '#888',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    tarefasContainer: {
        width: '100%',

        paddingVertical: 15,
        borderRadius: 20,
        top: -4,
    },
    tarefasTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#4682B4',
    },
    fichaContainer: {
        marginBottom: 10,
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        marginBottom: 55,
    },
    iconInsideInput: {
        marginRight: -1,
    },
    inputWithIconText: {
        flexDirection: 'column',
        marginLeft: 10,
    },
    ficha: {
       
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 20,
        marginBottom: 3,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    circleIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#4B6D9B',
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
        marginBottom: 20,
        textAlign: 'left',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        top: 10
    },
    modald: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'left',
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    

});

export default ScheduleHeader;
