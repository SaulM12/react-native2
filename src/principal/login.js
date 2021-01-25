import React, { useState } from 'react';
import {
    StyleSheet, View, TouchableOpacity, SafeAreaView, Text, Platform, StatusBar, Modal,
    Alert, TouchableHighlight
} from 'react-native';
import { Input } from 'react-native-elements';
import ContextNavigation from "../Screens/Context";
import firebase from "../Firebase/Firebase";
import "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
var md5 = require('md5');
export default function Login({ navigation }) {
    const [name, setUser] = useState("-------");
    const [password, setPassword] = useState("------");
    const { login } = React.useContext(ContextNavigation);
    const user = firebase.firestore().collection('Users');
    const [modalVisible, setModalVisible] = useState(false);
    const storeData = async (value) => {
        try {
          await AsyncStorage.setItem('@storage_Key', value)
        } catch (e) {
          // saving error
        }
      } 
    function loginUser() {
        user.where('userName', '==', name).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    if (doc.data().userPassword === md5(password)) {
                        storeData(doc.data().userName);
                        login()
                    } else {
                        setModalVisible(true);
                    }
                })
            }).catch((err) => {
                setModalVisible(true);
            })
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Datos incorrectos</Text>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>Aceptar</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>

            <SafeAreaView style={styles.container}>
                <Text style={styles.tittle}>Bienvenido</Text>
                <View style={styles.textInput}>
                    <Input
                        placeholder='Usuario'
                        onChangeText={returnOnChangeText => setUser(returnOnChangeText)}
                    />
                </View>
                <View style={styles.textInput}>
                    <Input
                        placeholder='Contraseña'
                        secureTextEntry={true}

                        onChangeText={returnOnChangeText => setPassword(returnOnChangeText)} />
                </View>

                <View style={styles.textInput}>
                    <TouchableOpacity style={styles.openButton} onPress={loginUser}><Text
                        style={{ textAlign: "center" }}>Ingresar</Text></TouchableOpacity>
                </View>
                <View style={styles.textInput}>
                    <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}><Text
                        style={{ textAlign: "center" }}>Registrarse</Text></TouchableOpacity>
                </View>

            </SafeAreaView>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    openButton: {
        backgroundColor: "#5AADF5",
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        margin: 10,
        textAlign: 'center'
    },
    registerButton: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        elevation: 2,
        margin: 20,
        textAlign: 'center'
    },
    textInput: {
        width: 275,
        fontFamily: 'serif',
    },
    tittle: {
        fontSize: 20,
        fontFamily: 'serif',
        padding: 10
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    }
});
