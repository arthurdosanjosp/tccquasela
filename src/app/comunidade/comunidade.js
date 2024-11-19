import React, { useState, useEffect } from 'react';
import {
    View,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Text,
    StatusBar,
    Modal,
    FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { doc, getDoc, addDoc, collection, updateDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CustomScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [colorModalVisible, setColorModalVisible] = useState(false);
    const [selectedColor, setSelectedColor] = useState('#ffffff');
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [tagModalVisible, setTagModalVisible] = useState(false);
    const [selectedTag, setSelectedTag] = useState('Tag');
    const [selectedTags, setSelectedTags] = useState([]);
    const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [visibleComments, setVisibleComments] = useState({});
    const [userName, setUserName] = useState('');
    const [commentUserName, setCommentUserName] = useState('');
    const colors = ['#4B6D9B', '#80C49F', '#E8CB73', '#CD6051', '#D17BC1', '#8F5EB6', '#6DCFCF', '#ED942B'];
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeFilter, setActiveFilter] = useState('Todas');
    const [isFilterVisible, setIsFilterVisible] = useState(true);




    const router = useRouter();
    const getRandomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    };
    const toggleFilter = (filterType) => {
        setActiveFilter(filterType);
    };
    const toggleFilterVisibility = () => {
        setIsFilterVisible(!isFilterVisible);
    };
    const getFilteredQuestions = () => {
        if (activeFilter === 'Todas') {
            return filteredQuestions; // Todas as perguntas sem filtro específico
        } else if (activeFilter === 'Minhas perguntas') {
            return filteredQuestions.filter(q => q.userName === values.name); // Filtra apenas as perguntas do usuário
        }
        return filteredQuestions;
    };

    const [values, setValues] = useState({
        name: '',
    });
    const [isEditing, setIsEditing] = useState({
    });
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
        const fetchUserName = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userDocRef = doc(db, 'usuarios', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        setUserName(userDoc.data().name); // Carrega o nome de usuário
                    } else {
                        console.error('Documento do usuário não encontrado no Firestore.');
                    }
                } else {
                    console.error('Usuário não autenticado.');
                }
            } catch (error) {
                console.error('Erro ao recuperar dados do usuário:', error);
            }
        };

        fetchUserName();
    }, []);

    useEffect(() => {
        const fetchQuestionsFromFirestore = async () => {
            try {
                const querySnapshot = await getDocs(query(collection(db, 'questions'), orderBy('date', 'desc')));
                const questionsArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setQuestions(questionsArray);
            } catch (error) {
                console.error('Erro ao carregar perguntas do Firestore:', error);
            }
        };

        fetchQuestionsFromFirestore();
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
                    } else {
                        console.error('Documento do usuário não encontrado no Firestore.');
                    }
                } else {
                    console.error('Usuário não autenticado.');
                }
            } catch (error) {
                console.error('Erro ao recuperar dados do usuário:', error);
            }
        };

        fetchUserData();
    }, []);
    const formatDate = (date) => {
        if (!date) return 'Data não disponível';
        const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        const day = date.getDate();
        const month = months[date.getMonth()];
        return `${day} ${month}`;
    };
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
    // Função para atualizar a lista filtrada com base no texto de pesquisa
    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredQuestions(questions);
        } else {
            const filtered = questions.filter(q =>
                q.question.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredQuestions(filtered);
        }
    }, [searchText, questions]);

    const handlePublish = async () => {
        if (newQuestion.trim() && newDescription.trim() && userName.trim()) {
            const newQuestionObject = {
                question: newQuestion,
                description: newDescription,
                color: selectedColor,
                date: new Date(),
                tag: selectedTag,
                comments: [],
                userName: userName, // Garante que cada pergunta use o `userName` atual
            };

            try {
                const docRef = await addDoc(collection(db, 'questions'), newQuestionObject);
                setQuestions((prevQuestions) => [
                    ...prevQuestions,
                    { ...newQuestionObject, id: docRef.id },
                ]);
                setModalVisible(false);
                setNewQuestion('');
                setNewDescription('');
                setSelectedTag('Tag');
            } catch (error) {
                console.error('Erro ao publicar a pergunta no Firestore:', error);
            }
        }
    };



    const handleTagSelect = (tag) => {
        setSelectedTag(tag);
        setTagModalVisible(false);
        setModalVisible(true);
    };
    const handleDescriptionModal = (question) => {
        setSelectedDescription('');
        setSelectedQuestionId(question.id); // Salva o ID da pergunta selecionada
        setDescriptionModalVisible(true);
    };
    const handlePublishComment = async () => {
        if (selectedDescription.trim() && commentUserName.trim()) {
            const newComment = {
                text: selectedDescription,
                userName: commentUserName,
                date: new Date()
            };

            try {
                const questionDocRef = doc(db, 'questions', selectedQuestionId);
                const updatedComments = [
                    ...questions.find(q => q.id === selectedQuestionId).comments,
                    newComment,
                ];

                await updateDoc(questionDocRef, { comments: updatedComments });

                setQuestions((prevQuestions) =>
                    prevQuestions.map((q) =>
                        q.id === selectedQuestionId ? { ...q, comments: updatedComments } : q
                    )
                );
                setDescriptionModalVisible(false);
                setSelectedDescription('');
                setCommentUserName('');
            } catch (error) {
                console.error('Erro ao publicar o comentário no Firestore:', error);
            }
        }
    };


    const toggleCommentsVisibility = (questionId) => {
        setVisibleComments((prevVisibleComments) => ({
            ...prevVisibleComments,
            [questionId]: !prevVisibleComments[questionId] // Alterna entre mostrar e ocultar
        }));
    };






    const renderQuestionItem = ({ item }) => {
        const formattedDate = new Date(item.date).toLocaleDateString(); // Formata a data para um formato legível
        const isVisible = visibleComments[item.id];
        const randomColor = getRandomColor();

        return (

            <View style={styles.questionCard}>
                {/* Título da Pergunta e Descrição */}
                <Text style={styles.questionTitle}>{item.question}</Text>
                <Text style={styles.questionDescription}>{item.description}</Text>

                {/* Exibe a tag selecionada */}
                {item.tag && (
                    <View style={styles.tagDisplayContainer}>
                        <Text style={styles.tagDisplayText}>{item.tag}</Text>
                    </View>
                )}

                {/* Usuário, Contagem de Comentários e Data */}
                <View style={styles.questionFooter}>
                    <View style={styles.userContainer}>
                        <View style={[styles.userAvatar, { backgroundColor: randomColor }]}>
                            <Text style={styles.userInitial}>
                                {item.userName ? item.userName.charAt(0).toUpperCase() : 'U'} { }
                            </Text>
                        </View>

                        <View style={styles.userInfo}>
                            <Text style={styles.infoValue}>{item.userName}</Text>
                        </View>
                    </View>

                    <View style={styles.commentInfo}>
                        {/* Ícone de comentários que abre o modal */}
                        <TouchableOpacity onPress={() => handleDescriptionModal(item)}>
                            <Icon name="chat-bubble-outline" size={16} color="#666" />
                        </TouchableOpacity>
                        {/* Texto que alterna a visibilidade dos comentários */}
                        <TouchableOpacity onPress={() => toggleCommentsVisibility(item.id)}>
                            <Text style={styles.commentCount}>
                                {item.comments?.length || 0} {item.comments?.length === 1 ? 'comentário' : 'comentários'}
                            </Text>
                        </TouchableOpacity>
                        <Icon name="access-time" size={16} color="#666" />
                        <Text style={styles.date}>
                            {item.date && item.date.toDate ? formatDate(item.date.toDate()) : 'Data não disponível'}
                        </Text>
                    </View>
                </View>

                {/* Comentários - aparecem apenas se estiverem visíveis */}
                {isVisible && (
                    <View style={styles.commentsContainer}>
                        {item.comments.length > 0 ? (
                            item.comments.map((comment, index) => (
                                <View key={index} style={styles.commentItem}>
                                    <Text style={styles.questionDescription}>{comment.text}</Text>

                                    <View style={styles.questionFooter}>
                                        <View style={styles.userContainer}>
                                            <View style={[styles.userAvatar, { backgroundColor: randomColor }]}>
                                                <Text style={styles.userInitial}>
                                                    {comment.userName ? comment.userName.charAt(0).toUpperCase() : 'U'}
                                                </Text>
                                            </View>

                                            <View style={styles.userInfo}>
                                                <Text style={styles.infoValue}>{comment.userName}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.commentInfo}>
                                            <Icon name="access-time" size={16} color="#666" />
                                            <Text style={styles.date}>
                                                {item.date && item.date.toDate ? formatDate(item.date.toDate()) : 'Data não disponível'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noCommentsText}>Nenhum comentário ainda.</Text>
                        )}

                    </View>
                )}
            </View>
        );
    };




    return (
        <View style={[styles.container, { flex: 1, backgroundColor: isDarkMode ? '#333' : 'white' }]}>
            <>
                <ImageBackground source={require('../img/gradient.png')} style={styles.navbar}>
                    <View style={styles.navTop}>
                        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                            <Icon name="arrow-back" size={35} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.title1}>Comunidade</Text>
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
                            onChangeText={(text) => setSearchText(text)}
                        />
                        <Icon name="search" size={24} color="#888" style={styles.searchIcon} />
                    </View>
                </ImageBackground>
                <View style={[styles.optionsContainer, { backgroundColor: isDarkMode ? '#333' : 'white' }]}>
    {isFilterVisible && (
        <>
            <TouchableOpacity onPress={() => toggleFilter('Todas')}>
                <Text style={[activeFilter === 'Todas' ? styles.optionTextActive : styles.optionText, { color: isDarkMode ? 'white' : 'black' }]}>Todas</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleFilter('Minhas perguntas')}>
                <Text style={[activeFilter === 'Minhas perguntas' ? styles.optionTextActive : styles.optionText, { color: isDarkMode ? 'white' : 'black' }]}>Minhas perguntas</Text>
            </TouchableOpacity>
        </>
    )}
    <TouchableOpacity style={styles.iconFilterButton} onPress={toggleFilterVisibility}>
        <Icon name="tune" size={24} color={isDarkMode ? 'white' : 'black'} />
    </TouchableOpacity>
</View>

                {/* List of questions */}
                <FlatList
                    data={getFilteredQuestions()}
                    keyExtractor={(item) => item.id}
                    renderItem={renderQuestionItem}
                    style={styles.questionList}
                />

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        setColorModalVisible(false);
                        setModalVisible(true);
                    }}
                >
                    <View style={styles.addIconContainer}>
                        <Icon name="add" size={30} color="#fff" />
                    </View>
                </TouchableOpacity>

                {/* Modal Principal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Icon name="arrow-back" size={25} color="#000" />
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>Faça uma pergunta</Text>
                            </View>

                            <Text style={styles.label}>
                                <Text style={styles.asterisk}>*</Text> Pergunta
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite sua pergunta"
                                value={newQuestion}
                                onChangeText={setNewQuestion}
                            />
                            <Text style={styles.label}>
                                <Text style={styles.asterisk}>*</Text> Descrição
                            </Text>
                            <TextInput
                                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                                multiline={false}
                                placeholder="Digite a descrição"
                                value={newDescription}
                                onChangeText={setNewDescription}
                            />
                            <Text style={styles.label}>
                                <Text style={styles.asterisk}>*</Text> Nome
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu nome"
                                value={userName}
                                onChangeText={setUserName}
                            />

                            <Text style={styles.label}>Tag</Text>
                            <View style={styles.tagContainer}>
                                <TouchableOpacity
                                    style={styles.tagButton}
                                    onPress={() => {
                                        setModalVisible(false);

                                        setTagModalVisible(true);
                                    }}
                                >
                                    <Text style={styles.tagText}>{selectedTag}</Text>
                                    <Icon name="arrow-drop-down" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.cancelText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.publishButton}
                                    onPress={handlePublish}
                                >
                                    <Text style={styles.publishText}>Publicar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={tagModalVisible}
                    onRequestClose={() => {
                        setTagModalVisible(false);
                        setModalVisible(true);
                    }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity onPress={() => setTagModalVisible(false)}>
                                    <Icon name="arrow-back" size={25} color="#000" />
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>Escolha uma opção</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.optionButton}
                                onPress={() => handleTagSelect('Blocos')}
                            >
                                <Text style={styles.optionText}>Blocos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.optionButton}
                                onPress={() => handleTagSelect('Excluir')}
                            >
                                <Text style={styles.optionText}>Excluir</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.optionButton}
                                onPress={() => handleTagSelect('Cor')}
                            >
                                <Text style={styles.optionText}>Cor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.optionButton}
                                onPress={() => handleTagSelect('Outros')}
                            >
                                <Text style={styles.optionText}>Outros</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={descriptionModalVisible}
                    onRequestClose={() => setDescriptionModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity onPress={() => setDescriptionModalVisible(false)}>
                                    <Icon name="arrow-back" size={25} color="#000" />
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>Respostas</Text>
                            </View>

                            <Text style={styles.label}> <Text style={styles.asterisk}>*</Text>Escreva sua resposta</Text>
                            <TextInput
                                style={[styles.input, { height: 100 }]}
                                multiline={false}
                                value={selectedDescription}
                                onChangeText={setSelectedDescription}
                            />
                            <Text style={styles.label}> <Text style={styles.asterisk}>*</Text>Nome</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu nome"
                                value={commentUserName}
                                onChangeText={setCommentUserName}
                            />

                            {/* Botões de Cancelar e Publicar */}
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setDescriptionModalVisible(false)}
                                >
                                    <Text style={styles.cancelText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.publishButton}
                                    onPress={handlePublishComment} // Função para publicar o comentário
                                >
                                    <Text style={styles.publishText}>Publicar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>



            </>
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
    navTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 100,
    },
    iconButton: {
        padding: 15,
        top: 10,
    },
    title1: {
        fontSize: 27,
        color: 'white',
        fontWeight: 'bold',
        top: 10,
    },
    searchContainer: {
        width: '100%',
        paddingHorizontal: 10,
        marginTop: 10,
    },
    searchBar: {
        width: '100%',
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    searchIcon: {
        position: 'absolute',
        right: 20,
        top: 8,
    },
    addButton: {
        position: 'absolute',
        bottom: 70,
        right: 40,
    },
    addIconContainer: {
        backgroundColor: '#4682B4',
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Estilos do modal
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Fundo escurecido
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    label: {
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        marginVertical: 5,
    },
    input: {
        width: '100%',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 1,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f5f5f5',
    },
    tagContainer: {
        width: '100%',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 1,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    tagText: {
        fontWeight: 'bold',
        color: 'white'
    },
    tagButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4682B4',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    tagButtonText: {
        color: '#fff',
        marginRight: 5,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderColor: '#4682B4',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    publishButton: {
        backgroundColor: '#4682B4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    cancelText: {
        color: '#4682B4',
        fontWeight: 'bold',
    },
    publishText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    asterisk: {
        color: 'red',
    },
    // Estilos do modal de cores

    saveButton2: {
        backgroundColor: 'white',
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'green',
        width: 70,
        left: 187,

    },

    saveButtonText: {
        color: 'green',
        fontSize: 14,
        fontWeight: 'bold',


    },
    backButton: {
        paddingRight: 10,
    },
    modalHeaderText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 1,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    optionText: {
        fontSize: 16,
        color: '#000',
        marginHorizontal: 10,
    },
    optionTextActive: {
        fontSize: 16,
        color: '#000',
        marginHorizontal: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#FFD700', // yellow underline for active option
    },
    iconFilterButton: {
        paddingHorizontal: 10,
    },
    questionCard: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#f5f5f5',
        backgroundColor: '#f5f5f5',
        width: '92%',
        left: 15,
    },
    questionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 7,
    },
    questionDescription: {
        fontSize: 15,
        color: '#666',
        marginBottom: 5,
    },
    questionList: {
        paddingHorizontal: 20,
    },
    questionFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#ccc', // You can use dynamic colors here
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInitial: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userName: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    commentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        
    },
    commentCount: {
        marginLeft: 8,
        fontSize: 13,
        color: '#666',

    },
    date: {
        marginLeft: 4,
        fontSize: 12,
        color: '#666',
    },
    optionButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        width: '100%',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 18,
        color: '#000',
    },
    tagDisplayContainer: {
        width: '30%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4682B4',
        paddingVertical: 2,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    tagDisplayText: {
        color: '#fff',
        marginRight: 5,
        

    },

    commentsContainer: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        marginTop: 10,
    },
    commentItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 5,
    },
    commentText: {
        fontSize: 14,
        color: '#333',
        marginTop: 5,
    },
    noCommentsText: {
        fontSize: 14,
        color: '#888',
        fontStyle: 'italic',
    },
    questionFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInitial: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userInfo: {
        marginLeft: 10,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    commentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },

});

export default CustomScreen;
