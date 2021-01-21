import React from 'react';
import {Button} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import NavigationRegions from '../Lists/regions';
import ItemNavigate from "../Lists/itemPlace";
import NavigationPlaces from '../components/places';
import ContextNavigation from "./context";

const Stack = createStackNavigator();


export default function PrincipalScreens() {
    const { logout } = React.useContext(ContextNavigation);
    return (

        <Stack.Navigator>
            <Stack.Screen name="Home" component={NavigationRegions}  options={{
                title: 'Regiones',
                headerStyle: {
                    backgroundColor: '#1D419E',
                        
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerRight: () => (
                    <Button
                      onPress={logout}
                      title="Salir"
                      color="#CC0404"
                    />
                  ),

            }} />
            <Stack.Screen name="Places" component={NavigationPlaces} options={{
                title: 'Lugares',
                headerStyle: {
                    backgroundColor: '#058394',

                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }} />
            <Stack.Screen name="Description" component={ItemNavigate} options={{
                title: 'Información',
                headerStyle: {
                    backgroundColor: '#29B0C2'
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
            />

        </Stack.Navigator>

    )
}
