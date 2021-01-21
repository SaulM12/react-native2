import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, Platform, StatusBar, SafeAreaView, ActivityIndicator } from "react-native";
import ItemRegions from '../Lists/itemRegions'

import firebase from "../firebase/firebase";
import "firebase/firestore";


export default function NavigationRegions({ navigation }) {
    const regions = firebase.firestore().collection('Regions');
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const synch = () => {
        let regionList = [];
        regions.get().then((snapshot) => {
            snapshot.forEach((doc) => {
                let RegionsFromFirebase = {
                    id: doc.id,
                    name: doc.data().name,
                    image: doc.data().image
                }
                regionList.push(RegionsFromFirebase)
            }
            )
            setData(regionList);
        }).finally(() => setLoading(false));
    }

    useEffect(() => {
        let isMounted = true;
        synch();
        return () => {
            isMounted = false
        }
    })

    return (
        <View>
            {
                isLoading ? (<ActivityIndicator/>)
                : (
            
            <SafeAreaView style={styles.container}>

                <FlatList
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <ItemRegions element={item} navigation={navigation} />
                    )}
                />

            </SafeAreaView>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    item: {
        backgroundColor: '#f9c2ff'
    }

})
