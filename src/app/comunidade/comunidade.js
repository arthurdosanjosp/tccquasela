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
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';


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
    const colors = ['#4B6D9B', '#80C49F', '#E8CB73', '#CD6051', '#D17BC1', '#8F5EB6', '#6DCFCF', '#ED942B'];
    




    const router = useRouter();
    const getRandomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const [values, setValues] = useState({
        name: '',
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

    const handlePublish = () => {
        if (newQuestion.trim() && newDescription.trim()) {
            // Adiciona nova pergunta à lista com a data atual
            const newQuestionObject = {
                id: questions.length + 1,
                question: newQuestion,
                description: newDescription,
                color: selectedColor,
                date: new Date(),
                tag: selectedTag,
                comments: [] // Inicialmente sem comentários
            };
            setQuestions([...questions, newQuestionObject]);
            setModalVisible(false);
            setNewQuestion(''); // Limpa o campo de pergunta
            setNewDescription(''); // Limpa o campo de descrição
            setSelectedTag('Tag'); // Reseta a tag selecionada
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
    const handlePublishComment = () => {
        if (selectedDescription.trim()) {
            // Adiciona a nova resposta como um comentário à pergunta selecionada
            const updatedQuestions = questions.map(q => {
                if (q.id === selectedQuestionId) {
                    return {
                        ...q,
                        comments: [...(q.comments || []), selectedDescription], // Adiciona o comentário
                    };
                }
                return q;
            });

            setQuestions(updatedQuestions); // Atualiza o estado das perguntas
            setDescriptionModalVisible(false); // Fecha o modal
            setSelectedDescription(''); // Limpa o campo de descrição
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
                                {values.name ? values.name.charAt(0).toUpperCase() : 'U'} { }
                            </Text>
                        </View>

                        <View style={styles.userInfo}>
                            <Text style={styles.infoValue}>{values.name}</Text>
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
                            {new Date(item.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                        </Text>
                    </View>
                </View>

                {/* Comentários - aparecem apenas se estiverem visíveis */}
                {isVisible && (
                    <View style={styles.commentsContainer}>
                        {item.comments.length > 0 ? (
                            item.comments.map((comment, index) => (
                                <View key={index} style={styles.commentItem}>
                                    <Text style={styles.questionDescription}>{comment}</Text>
                                    {/* Estrutura do comentário igual à pergunta */}
                                    <View style={styles.questionFooter}>
                                        <View style={styles.userContainer}>
                                        <View style={[styles.userAvatar, { backgroundColor: randomColor }]}>
                                                <Text style={styles.userInitial}>
                                                    {values.name ? values.name.charAt(0).toUpperCase() : 'U'} { }
                                                </Text>
                                            </View>


                                            <View style={styles.userInfo}>
                                                <Text style={styles.infoValue}>{values.name}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.commentInfo}>
                                            <Icon name="access-time" size={16} color="#666" />
                                            <Text style={styles.date}>
                                                {new Date(item.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Texto do comentário */}
                                    <Text style={styles.commentText}>{comment.text}</Text>
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
            <View style={styles.optionsContainer}>
                <TouchableOpacity>
                    <Text style={styles.optionTextActive}>Todas</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.optionText}>Minhas perguntas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconFilterButton}>
                    <Icon name="tune" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            {/* List of questions */}
            <FlatList
                data={filteredQuestions} // Use a lista filtrada
                keyExtractor={(item) => item.id.toString()}
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
                            style={[styles.input, { height: 100 }]}
                            multiline={true}
                            placeholder="Digite a descrição"
                            value={newDescription}
                            onChangeText={setNewDescription}
                        />
                        <Text style={styles.label}>Tag</Text>
                        <View style={styles.tagContainer}>
                            <TouchableOpacity
                                style={styles.tagButton}
                                onPress={() => {
                                    setModalVisible(false); // Fecha o modal principal se estiver aberto
                                    setTagModalVisible(true); // Abre o modal de tags
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
                            multiline={true}
                            value={selectedDescription}
                            onChangeText={setSelectedDescription} // Atualiza o estado conforme o texto é digitado
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
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 15,
        height: 190,
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
        fontSize: 28,
        color: 'white',
        fontWeight: 'bold',
        right: 45,
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
        paddingHorizontal: 10,
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
        marginLeft: 7,
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
        width: '26%',
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
