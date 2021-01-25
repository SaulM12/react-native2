import React, { useEffect, useState } from "react";
import {View, FlatList, StyleSheet, Platform, StatusBar, SafeAreaView, ActivityIndicator } from "react-native";
import {useRoute} from '@react-navigation/native';
import NavigateDescription from '../Lists/ItemPlaceDescription'
import firebase from "../Firebase/Firebase";
import "firebase/firestore";

export default function NavigationPlaces({ navigation }) {

    const place = firebase.firestore().collection('Places');
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    let route = useRoute();
    let id = route.params.id;
   
    const synch = () => {
        let placesList = [];
        place.where('FK_region_id','==',id).get().then((snapshot) => {
            snapshot.forEach((doc) => {
                let PlacesFromFirebase = {
                    id: doc.id,
                    name: doc.data().name,
                    image: doc.data().image,
                    image_2: doc.data().image_2,
                    image_3: doc.data().image_3,
                    ubication: doc.data().ubication,
                    FK_region_id: doc.data().FK_region_id ,
                    description: doc.data().description ,              
                } 
                
                    placesList.push(PlacesFromFirebase)
            
            }
            )
            setData(placesList);

        }).finally(() => setLoading(false));
    }
    useEffect(() => {
        let isMounted = true;
        synch();

        return () => {
            isMounted = false
        };
    }, [])



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
                        <NavigateDescription element={item} navigation={navigation} />
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