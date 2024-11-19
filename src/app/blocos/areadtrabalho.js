import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground, TouchableOpacity, StatusBar, TextInput, Modal, ScrollView, Alert, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Drawer from './Drawer';
import DateTimePicker from '@react-native-community/datetimepicker';
const saveColunas = async (colunas) => {
    try {
        await AsyncStorage.setItem('colunas', JSON.stringify(colunas));
    } catch (error) {
        console.error('Falha ao salvar colunas', error);
    }
};

const loadColunas = async () => {
    try {
        const savedColunas = await AsyncStorage.getItem('colunas');
        if (savedColunas !== null) {
            return JSON.parse(savedColunas);
        }
    } catch (error) {
        console.error('Falha ao carregar colunas', error);
    }
    return [];
};

const saveFichaInput = async (fichaId, inputText) => {
    try {
        await AsyncStorage.setItem(`ficha_${fichaId}`, inputText);
    } catch (e) {
        console.error("Falha ao salvar input da ficha no AsyncStorage", e);
    }
};

const loadFichaInput = async (fichaId) => {
    try {
        const inputText = await AsyncStorage.getItem(`ficha_${fichaId}`);
        return inputText || '';
    } catch (e) {
        console.error("Falha ao carregar input da ficha do AsyncStorage", e);
        return '';
    }
};

const saveFavoritedBlocks = async (blocks) => {
    try {
        console.log('Saving Favorited Blocks:', blocks);
        await AsyncStorage.setItem('favoritedBlocks', JSON.stringify(blocks));
    } catch (error) {
        console.error('Falha ao salvar blocos favoritados', error);
    }
};

const loadFavoritedBlocks = async () => {
    try {
        const savedBlocks = await AsyncStorage.getItem('favoritedBlocks');
        if (savedBlocks !== null) {
            console.log('Favorited Blocks Loaded:', JSON.parse(savedBlocks));
            return JSON.parse(savedBlocks);
        }
    } catch (error) {
        console.error('Falha ao carregar blocos favoritados', error);
    }
    return [];
};
const saveBlockColor = async (blockName, color) => {
    try {
        await AsyncStorage.setItem(`blockColor_${blockName}`, color);
    } catch (e) {
        console.error("Failed to save block color to AsyncStorage", e);
    }
};

const loadBlockColor = async (blockName) => {
    try {
        const color = await AsyncStorage.getItem(`blockColor_${blockName}`);
        return color || '#4B6D9B'; // Define cor padrão caso não haja cor salva
    } catch (e) {
        console.error("Falha ao carregar a cor do bloco do AsyncStorage", e);
        return '#4B6D9B';
    }
};




export default function Areadtrabalho() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [blockName, setBlockName] = useState('');
    const [selectedColor, setSelectedColor] = useState('#4B6D9B');
    const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
    const [blockToDeleteId, setBlockToDeleteId] = useState(null);
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const [fichas, setFichas] = useState([]);
    const [addFichaModalVisible, setAddFichaModalVisible] = useState(false);
    const [fichaNome, setFichaNome] = useState('');
    const [colunas, setColunas] = useState([]);
    const [fichaModalVisible, setFichaModalVisible] = useState(false);
    const [selectedFicha, setSelectedFicha] = useState(null);
    const [fichaInput1, setFichaInput1] = useState('');
    const [favoritedBlocks, setFavoritedBlocks] = useState([]);
    const [checkedBlocks, setCheckedBlocks] = useState([]);
    const [hiddenBlocks, setHiddenBlocks] = useState([]);
    const [editDateModalVisible, setEditDateModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedColunaId, setSelectedColunaId] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [movingFicha, setMovingFicha] = useState(null);
    const [filteredFichas, setFilteredFichas] = useState([]);
    const [filterOption, setFilterOption] = useState('Hoje');
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
        const loadInitialData = async () => {
            const savedColunas = await loadColunas();
            for (const coluna of savedColunas) {
                for (const ficha of coluna.fichas) {
                    ficha.description = await loadFichaInput(ficha.nome);
                }
            }
            setColunas(savedColunas);
            const loadedFavoritedBlocks = await loadFavoritedBlocks();
            setFavoritedBlocks(loadedFavoritedBlocks);
            const savedCheckedBlocks = await AsyncStorage.getItem('checkedBlocks');
            if (savedCheckedBlocks !== null) {
                setCheckedBlocks(JSON.parse(savedCheckedBlocks));
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        const loadBlocks = async () => {
            try {
                const savedBlocks = await AsyncStorage.getItem('blocks');
                if (savedBlocks !== null) {
                    const blocks = JSON.parse(savedBlocks);

                    for (const block of blocks) {

                        const savedBlockName = await AsyncStorage.getItem(`blockName_${block.name}`);
                        if (savedBlockName) {
                            block.name = savedBlockName;
                        }

                        const savedBlockColor = await AsyncStorage.getItem(`blockColor_${block.name}`);
                        block.color = savedBlockColor || block.color;


                    }

                    setData(blocks);
                }
            } catch (error) {
                console.error('Falha ao carregar blocos', error);
            }
        };

        loadBlocks();
    }, []);
    useEffect(() => {
        const loadCheckedBlocks = async () => {
            const savedCheckedBlocks = await AsyncStorage.getItem('checkedBlocks');
            setCheckedBlocks(savedCheckedBlocks ? JSON.parse(savedCheckedBlocks) : []);
        };
        loadCheckedBlocks();
    }, []);

    useEffect(() => {
        const saveBlocks = async () => {
            try {
                await AsyncStorage.setItem('blocks', JSON.stringify(data));
            } catch (error) {
                console.error('Falha ao salvar blocos', error);
            }
        };

        saveBlocks();
    }, [data]);

    useEffect(() => {
        const filterData = () => {
            const filtered = data.filter(block => block.name.toLowerCase().includes(searchText.toLowerCase()));
            setFilteredData(filtered);
        };

        filterData();
    }, [searchText, data]);

    useEffect(() => {
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
        loadCheckedBlocks();
    }, []);

    useEffect(() => {
        const saveCheckedBlocks = async () => {
            try {
                await AsyncStorage.setItem('checkedBlocks', JSON.stringify(checkedBlocks));
            } catch (error) {
                console.error('Falha ao salvar blocos checados', error);
            }
        };
        saveCheckedBlocks();
    }, [checkedBlocks]);

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

    useEffect(() => {
        const saveHiddenBlocks = async () => {
            try {
                await AsyncStorage.setItem('hiddenBlocks', JSON.stringify(hiddenBlocks));
            } catch (error) {
                console.error('Falha ao salvar blocos ocultos', error);
            }
        };
        saveHiddenBlocks();
    }, [hiddenBlocks]);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleCreateBlock = async () => {
        const newBlock = {
            id: data.length + 1,
            name: blockName,
            color: selectedColor,
        };

        setData([...data, newBlock]);
        setBlockName('');
        setSelectedColor('#4B6D9B');
        setModalVisible(false);

        const updatedColunas = [...colunas];
        updatedColunas.push({ nome: blockName, fichas: [] });
        setColunas(updatedColunas);

        // Salva a cor do bloco no AsyncStorage
        await saveBlockColor(blockName, selectedColor);
    };
    const handleDeleteBlock = (id) => {
        setBlockToDeleteId(id);
        setConfirmDeleteModalVisible(true);
    };

    const handleDeleteConfirmed = () => {
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
    };

    const handleOpenAddFichaModal = () => {
        setAddFichaModalVisible(true);
    };

    const handleCloseAddFichaModal = () => {
        setAddFichaModalVisible(false);
    };

    const handleCreateFicha = () => {
        const formattedDate = new Date().toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
        }).replace('.', '');

        const novaFicha = {
            id: Date.now(),
            nome: fichaNome,
            date: formattedDate,
        };

        const updatedColunas = [...colunas];
        if (updatedColunas.length > 0) {
            const lastColunaIndex = updatedColunas.length - 1;
            updatedColunas[lastColunaIndex].fichas.push(novaFicha);
        } else {
            updatedColunas.push({ nome: fichaNome, fichas: [novaFicha] });
        }

        setColunas(updatedColunas);
        setFichaNome('');
        setAddFichaModalVisible(false);

        saveColunas(updatedColunas);
    };

    const handleOpenFichaModal = async (ficha) => {
        setSelectedFicha(ficha);
        const loadedInput = await loadFichaInput(ficha.nome);
        setFichaInput1(loadedInput);
        setFichaModalVisible(true);
    };

    const handleCloseFichaModal = () => {
        setFichaModalVisible(false);
        setSelectedFicha(null);
    };

    const handleDeleteFicha = async () => {
        if (!selectedFicha) return;

        const updatedColunas = [...colunas];
        const columnIndex = updatedColunas.findIndex(coluna => coluna.fichas.some(ficha => ficha.id === selectedFicha.id));
        if (columnIndex !== -1) {
            const updatedFichas = updatedColunas[columnIndex].fichas.filter(ficha => ficha.id !== selectedFicha.id);
            updatedColunas[columnIndex].fichas = updatedFichas;
            setColunas(updatedColunas);

            await saveColunas(updatedColunas);

            handleCloseFichaModal();
        }
    };

    const handleSaveInput = async () => {
        if (selectedFicha) {
            await saveFichaInput(selectedFicha.nome, fichaInput1);
            const updatedColunas = colunas.map(coluna => {
                const updatedFichas = coluna.fichas.map(ficha => {
                    if (ficha.id === selectedFicha.id) {
                        return { ...ficha, description: fichaInput1 };
                    }
                    return ficha;
                });
                return { ...coluna, fichas: updatedFichas };
            });
            setColunas(updatedColunas);
            alert('Ficha salva com sucesso!');
        }
    };

    const toggleFavorite = async (blockName) => {
        setFavoritedBlocks(prevState => {
            const newState = prevState.includes(blockName)
                ? prevState.filter(name => name !== blockName)
                : [...prevState, blockName];
            saveFavoritedBlocks(newState); // Salva o estado atualizado no AsyncStorage
            return newState;
        });
    };


    const handleSearchTextChange = (text) => {
        setSearchText(text);
    };

    const toggleCheckBlock = (id) => {
        setCheckedBlocks(prevCheckedBlocks => {
            const isChecked = prevCheckedBlocks.includes(id);
            if (isChecked) {
                return prevCheckedBlocks.filter(blockId => blockId !== id);
            } else {
                return [...prevCheckedBlocks, id];
            }
        });
    };

    const handleVisibilityToggle = (id) => {
        setHiddenBlocks(prevState => {
            const isHidden = prevState.includes(id);
            if (isHidden) {
                return prevState.filter(blockId => blockId !== id);
            } else {
                Alert.alert('Bloco ocultado com sucesso!');
                return [...prevState, id];
            }
        });
    };
    const handleSaveEditedDate = async () => {
        if (selectedFicha && selectedDate instanceof Date) { // Verifica se selectedDate é um objeto Date
            const updatedColunas = [...colunas];
            // Encontra o índice da coluna que contém a ficha selecionada
            const columnIndex = updatedColunas.findIndex(coluna =>
                coluna.fichas.some(f => f.id === selectedFicha.id)
            );

            if (columnIndex !== -1) {
                // Atualiza a data da ficha dentro da coluna encontrada
                const updatedFichas = updatedColunas[columnIndex].fichas.map(f => {
                    if (f.id === selectedFicha.id) {
                        return { ...f, date: formatDate(selectedDate) }; // Atualiza a data formatada
                    }
                    return f;
                });

                updatedColunas[columnIndex].fichas = updatedFichas; // Atualiza a lista de fichas na coluna
                setColunas(updatedColunas); // Atualiza o estado com as novas colunas

                await saveColunas(updatedColunas); // Salva as colunas atualizadas no AsyncStorage
            }

            alert(`Data salva: ${formatDate(selectedDate)}`); // Exibe a data salva como alerta
            setEditDateModalVisible(false);
            setFichaModalVisible(true);
        } else {
            console.error('selectedDate deve ser um objeto Date');
        }
    };
    const handleEditDate = () => {
        setFichaModalVisible(false);
        setEditDateModalVisible(true);
        setShowDatePicker(true);
    };
    const moveFichaToColuna = (colunaId) => {
        if (!movingFicha) return;

        const updatedColunas = colunas.map(coluna => {

            coluna.fichas = coluna.fichas.filter(f => f.id !== movingFicha.id);

            if (coluna.id === colunaId) {
                coluna.fichas.push(movingFicha);
            }
            return coluna;
        });

        setColunas(updatedColunas);
        setMovingFicha(null);
    };


    const handleLongPressFicha = (ficha) => {
        setMovingFicha(ficha);
    };
    const onDateChange = (event, date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
        }
    };
    const formatDate = (date) => {
        if (!(date instanceof Date)) {
            return '';
        }

        const day = date.toLocaleDateString('pt-BR', { day: 'numeric' });
        const month = date.toLocaleDateString('pt-BR', { month: 'short' });


        return `${day} de ${month.replace('.', '')}`;
    };
    const filterFichasByDate = (fichas) => {
        const today = new Date();

        return fichas.filter(ficha => {
            const fichaDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Ajusta a data da ficha

            if (filterOption === 'Hoje') {
                return ficha.date === formatDate(today);
            }

            if (filterOption === 'Semana') {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());


                const endOfWeek = new Date(today);
                endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
                endOfWeek.setHours(23, 59, 59, 999);

                return fichaDate >= startOfWeek && fichaDate <= endOfWeek;
            }


            if (filterOption === 'Mês') {
                return fichaDate.getMonth() === today.getMonth() && fichaDate.getFullYear() === today.getFullYear();
            }

            return true;
        });
    };
    useEffect(() => {
        const filteredColunas = colunas.map(coluna => ({
            ...coluna,
            fichas: filterFichasByDate(coluna.fichas)
        }));

        setFilteredFichas(filteredColunas);
    }, [filterOption, colunas]);

    // Função para alterar a opção de filtro
    const handleFilterChange = (option) => {
        setFilterOption(option);
    };


    const renderItem = ({ item }) => (
        // Se o bloco estiver na lista de blocos ocultos, não renderize ele
        hiddenBlocks.includes(item.id) ? null : (
            <TouchableOpacity
                onPress={() => router.push(`/tarefas/fichas?blockName=${item.name}`)}
            >
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
                            <Icon name="visibility" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.iconTouchable}
                            onPress={() => handleDeleteBlock(item.id)}
                        >
                            <Icon name="delete" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        )
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
                <View style={styles.titleContainer}>
                    <Text style={styles.title2}>Área de Trabalho</Text>
                    <TouchableOpacity style={styles.addIcon} onPress={handleOpenModal}>
                        <Icon name="add" size={28} color={isDarkMode ? 'white' : 'black'} />
                    </TouchableOpacity>
                </View>
                <Text style={[styles.subtitle, { color: isDarkMode ? 'white' : 'black' }]}>Meus Blocos</Text>
                <FlatList
                    data={filteredData}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatlistContainer}
                />
            </View>


            {/* Minhas Tarefas Section */}
            <View style={styles.taskFilterContainer}>
                <View style={styles.taskFilterTitleContainer}>
                    <Text style={[styles.taskFilterTitle, { color: isDarkMode ? 'white' : 'black' }]}>Minhas Tarefas</Text>
                    <TouchableOpacity style={styles.addTaskIcon} onPress={handleOpenAddFichaModal}>
                        <Icon name="add" size={28} color={isDarkMode ? 'white' : 'black'} />

                    </TouchableOpacity>
                </View>
                <View style={styles.taskFilterButtons}>
                    <TouchableOpacity style={styles.taskFilterButton} onPress={() => handleFilterChange('Hoje')}>
                        <Text style={styles.taskFilterButtonText}>Hoje</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.taskFilterButton} onPress={() => handleFilterChange('Semana')}>
                        <Text style={styles.taskFilterButtonText}>Semana</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.taskFilterButton} onPress={() => handleFilterChange('Mês')}>
                        <Text style={styles.taskFilterButtonText}>Mês</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.scrollContainer}>
                    <View style={styles.colunasContainer}>
                        {colunas.map((coluna, index) => (
                            <View key={index} style={styles.tarefasContainer}>
                                {filterFichasByDate(coluna.fichas).map((ficha, fichaIndex) => (
                                    <TouchableOpacity key={fichaIndex} style={styles.fichaContainer} onPress={() => handleOpenFichaModal(ficha)}>
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
                                                <TouchableOpacity onPress={() => toggleCheckBlock(ficha.id)}>
                                                    <Icon name="check-box" size={24} color={checkedBlocks.includes(ficha.id) ? "green" : "#888"} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </View>
                </ScrollView>


                {/* Modal de Criar Bloco */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={handleCloseModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Criar um bloco</Text>
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
                                    <View style={[styles.colorCircle, styles.blue, selectedColor === '#4B6D9B' && { borderWidth: 2, borderColor: 'white' }]} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleColorSelect('#80C49F')}>
                                    <View style={[styles.colorCircle, styles.green, selectedColor === '#80C49F' && { borderWidth: 2, borderColor: 'white' }]} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleColorSelect('#E8CB73')}>
                                    <View style={[styles.colorCircle, styles.yellow, selectedColor === '#E8CB73' && { borderWidth: 2, borderColor: 'white' }]} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleColorSelect('#CD6051')}>
                                    <View style={[styles.colorCircle, styles.red, selectedColor === '#CD6051' && { borderWidth: 2, borderColor: 'white' }]} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleColorSelect('#D17BC1')}>
                                    <View style={[styles.colorCircle, styles.pink, selectedColor === '#D17BC1' && { borderWidth: 2, borderColor: 'white' }]} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleColorSelect('#8F5EB6')}>
                                    <View style={[styles.colorCircle, styles.purple, selectedColor === '#8F5EB6' && { borderWidth: 2, borderColor: 'white' }]} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleColorSelect('#6DCFCF')}>
                                    <View style={[styles.colorCircle, styles.cyan, selectedColor === '#6DCFCF' && { borderWidth: 2, borderColor: 'white' }]} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleColorSelect('#ED942B')}>
                                    <View style={[styles.colorCircle, styles.orange, selectedColor === '#ED942B' && { borderWidth: 2, borderColor: 'white' }]} />
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

                {/* Modal de Adicionar Ficha */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={addFichaModalVisible}
                    onRequestClose={handleCloseAddFichaModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Adicionar Ficha</Text>
                            <Text style={styles.modald}>Nome da ficha</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Escreva o nome da ficha aqui"
                                value={fichaNome}
                                onChangeText={setFichaNome}
                            />
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.cancelButton} onPress={handleCloseAddFichaModal}>
                                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.createButton} onPress={handleCreateFicha}>
                                    <Text style={styles.createButtonText}>Criar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Modal de Confirmação de Exclusão */}
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
                <Modal
                    visible={fichaModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={handleCloseFichaModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{selectedFicha ? selectedFicha.nome : 'Detalhes da Ficha'}</Text>
                                <TouchableOpacity style={styles.closeIcon} onPress={handleCloseFichaModal}>
                                    <Icon name="close" size={24} color="#fff" style={styles.closeIcon} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="view-quilt" size={20} color="#888" style={{ marginRight: 1 }} />
                                <Text style={styles.modalSubtitle}>Descrição</Text>
                            </View>

                            <TextInput
                                style={[styles.input2, { textAlignVertical: 'top' }]} // Garante que o texto comece do topo
                                placeholder="Escreva algo aqui"
                                value={fichaInput1}
                                onChangeText={setFichaInput1}
                                placeholderTextColor="#888"
                                multiline={false} // Impede múltiplas linhas
                                numberOfLines={1}
                                maxLength={100} // Limite de caracteres, se necessário
                            />

                            <TouchableOpacity style={styles.saveButton} onPress={handleSaveInput}>
                                <Text style={styles.saveButtonText}>Salvar</Text>
                            </TouchableOpacity>

                            <View style={styles.inputWithIcon}>
                                <Icon name="schedule" size={20} color="#888" style={styles.iconInsideInput} />
                                <View style={styles.inputWithIconText}>
                                    <Text>Data</Text>
                                    <Text style={styles.timeText}>{selectedFicha ? selectedFicha.date : ''}</Text>
                                </View>
                                <TouchableOpacity onPress={handleEditDate}>
                                    <Text style={styles.editText}>Editar</Text>
                                </TouchableOpacity>
                                <View style={styles.deleteButtonContainer}>
                                    <TouchableOpacity onPress={handleDeleteFicha} style={styles.deleteButton}>
                                        <Icon name="delete" size={20} color="red" style={{ marginRight: 10 }} />
                                        <Text style={styles.deleteButtonText}>Deletar Ficha</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={editDateModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setEditDateModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setEditDateModalVisible(false)}
                            >
                                <Icon name="close" size={24} color="white" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Editar Data</Text>

                            {/* Botão para abrir o calendário */}
                            <TouchableOpacity onPress={handleEditDate}>
                                <Text style={styles.dateButtonText}>
                                    {formatDate(selectedDate)} {/* Exibe a data formatada */}
                                </Text>
                            </TouchableOpacity>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display="default"
                                    onChange={onDateChange} // Função chamada ao alterar a data
                                />
                            )}

                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSaveEditedDate} // Chama a função para salvar a data
                            >
                                <Text style={styles.saveButtonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>
        </View>


    );
}
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
        marginTop: -15,
        paddingHorizontal: 30,
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
        right: 8,

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
        paddingHorizontal: 10,
        left: 10,
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
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        color: 'gray',
        backgroundColor: 'white',
    },
    input2: {
        width: '100%',
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 25,
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
        top: 5,
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

    idText: {
        fontSize: 18,

    },
    contentText: {
        fontSize: 14,
        color: '#666666',
        marginTop: 4,
        marginBottom: 4,
    },
    circleIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: ''
    },
    iconContainer: {
        marginRight: 12,
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
    deleteButton: {
        flexDirection: 'row', // Para alinhar o ícone e o texto na mesma linha
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20, // Ajuste conforme necessário
        borderColor: '#CD6051',
        borderWidth: 1,
        borderRadius: 50,
        backgroundColor: 'white',
        top: 60,
        right: 250,
    },
    deleteButtonTouchable: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 10,
    },
    deleteButtonText: {
        color: '#CD6051',
        fontSize: 16,
        marginLeft: 0, // Espaçamento entre o ícone e o texto
    },
    saveButton: {
        position: 'absolute',
        top: 55,  // Ajuste conforme necessário
        right: 22, // Ajuste conforme necessário
        backgroundColor: 'white',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'green',

    },

    saveButtonText: {
        color: 'green',
        fontSize: 14,
        fontWeight: 'bold',

    },
    checkboxContainer: {
        paddingLeft: 12,
    },
    editText: {
        marginLeft: 110,
        color: '#007BFF', // Cor do texto "Editar"
        fontSize: 12,
        fontWeight: 'bold',
    },
    closeIcon: {
        top: -5,
    },
    dateButtonText: {
        color: 'white',
        fontSize: 18
    }
});
