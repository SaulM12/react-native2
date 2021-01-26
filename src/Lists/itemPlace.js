import React, { useEffect, useState } from "react";
import { Dimensions, Image, TouchableOpacity, StyleSheet, Text, View,  ActivityIndicator, FlatList, SafeAreaView } from "react-native";
import { useRoute } from '@react-navigation/native';
import Carousel from 'simple-carousel-react-native';
import { ScrollView } from "react-native-gesture-handler";
import { Input } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from "../Firebase/Firebase";
import "firebase/firestore";

const { width: screenWidth } = Dimensions.get('window')
export default function ItemNavigate() {
      
    let route = useRoute();
    let item = route.params.item;
    const [userName, setUserName] = useState('');
    const [userComment, setComment] = useState("-------");
    const comments = firebase.firestore().collection('Comments');
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const newComment = React.createRef();

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@storage_Key')
            if (value !== null) {
                setUserName(value);
            }

        } catch (e) {

        }
    }

    function addComment() {
        let comment = {
            user: userName,
            comment: userComment,
            FK_place_id: item.id
        }
        comments.doc().set(comment);
        synch();
        newComment.current.clear();
      
    }

    const synch = () => {
        let commentsList = [];
        comments.where('FK_place_id','==',item.id).get().then((snapshot) => {
            snapshot.forEach((doc) => {
                let commentsFromFirebase = {
                    id: doc.id,
                    user: doc.data().user,
                    comment: doc.data().comment,
                }

                commentsList.push(commentsFromFirebase)

            })
            setData(commentsList);
            

        }).finally(() => setLoading(false));
    }

    useEffect(() => {
        let isMounted = true;
        getData();
        synch();
        return () => { isMounted = false };
    }, [])

    return (

        <ScrollView >
            <View style={styles.item}>
                <View style={styles.container1}>
                    <Carousel >
                        <View style={styles.containerImage}>
                            <Image style={styles.image} source={{ uri: item.image }} />
                        </View>
                        <View style={styles.containerImage}>
                            <Image style={styles.image} source={{ uri: item.image_2 }} />
                        </View>
                        <View style={styles.containerImage}>
                            <Image style={styles.image} source={{ uri: item.image_3 }} />
                        </View>
                    </Carousel>
                </View>
                <View>
                    <Text style={styles.Text}>
                        {item.name}
                    </Text>
                </View>
                <View style={styles.containerInfo}>
                    <Text style={styles.ubication}>
                        {item.ubication}
                    </Text>
                </View>
                <View style={styles.containerInfo2}>
                    <Text style={styles.description}>
                        {item.description}
                    </Text>
                </View>
                <View >
                    <Text style={styles.Text5}> ¿Te gustó este lugar? Deja un comentario</Text>
                    <Text style={styles.Text4}> {userName}  </Text>
                </View>
                <View style={styles.textInput}>
                    <Input
                        placeholder='Reseña'
                        onChangeText={returnOnChangeText => setComment(returnOnChangeText)}
                        ref={newComment}
                    />
                </View>
                <View style={styles.textInput}>
                    <TouchableOpacity style={styles.commentButton} onPress={addComment}><Text
                        style={{ textAlign: "center", color: '#FFFFFF' }}>Publicar</Text></TouchableOpacity>
                </View>
            </View>

            <View style={styles.item}>
            <Text style={styles.Text5}> Comentarios</Text>
                <View>
                    {
                        isLoading ? (<ActivityIndicator />)
                            : (

                                <SafeAreaView >

                                    <FlatList
                                        data={data}
                                        keyExtractor={item => item.id}
                                        renderItem={({ item }) => (
                                            <View style={styles.containerComment}>
                                            
                                                
                                                <View style={styles.container}>
                                                <Text style={styles.Text3}> {item.user}:  </Text>
                                                
                                                <Text style={styles.Text2}>{item.comment}</Text>
                                                
                                                </View>
                                                
                                            </View>)}
                                    />

                                </SafeAreaView>
                            )
                    }
                </View>


            </View>

        </ScrollView>


    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#E8E8E8',
        flexDirection:'row'
    },
    containerComment: {
    borderColor:'#6E6E6E',
    borderWidth:2,
    margin:2
    },
    carousel: {

    },
    item: {
        backgroundColor: '#fff',
        padding: 5,
        marginVertical: 8,
        marginHorizontal: 5,
        flexDirection: 'column',
        width: screenWidth - 10,
    },
    containerImage: {
        margin: 0,
        marginTop: 25,
        alignItems: 'center',
        padding: 2
    },
    image: {
        width: screenWidth - 20,
        height: 250,

    },
    containerInfo: {
        flex: 5,
        margin: 4
    },
    Text: {
        fontSize: 25,
        justifyContent: 'center',
        
        fontFamily: 'serif',

    },
    Text2: {
        marginTop: 10,
        fontSize: 15,
        marginBottom:2,
        justifyContent: 'center',
        fontFamily: 'serif',
       
    },
    Text3: {
        marginTop: 7,
        fontSize: 18,
        justifyContent: 'center',
        fontFamily: 'serif',
     
    },
    Text4: {
        marginTop: 10,
        fontSize: 18,
        justifyContent: 'center',
        fontFamily: 'serif',
        backgroundColor: '#E8E8E8'
    },
    Text5: {
        marginTop: 10,
        fontSize: 18,
        justifyContent: 'center',
        fontFamily: 'serif',
     
    },
    containerInfo2: {
        marginTop: 30,
        marginLeft: 8,
        textAlign: 'left',
        flexDirection: 'column',
    },
    ubication: {
        fontSize: 13,
        fontFamily: 'serif',
    },
    description: {
        fontSize: 14,
        fontFamily: 'serif',
        textAlign: 'justify'
    },
    container1: {
        marginTop: 60,
        height: 225,
        justifyContent: 'center',
        alignItems: 'center',

    },
    textInput: {

        fontFamily: 'serif',
        backgroundColor: '#E8E8E8'
    },
    commentButton: {
        backgroundColor: "#10AD2F",
        borderRadius: 1,
        padding: 8,
        elevation: 2,
        margin: 5,
        textAlign: 'center',
        color: '#FFF',

    }
})
