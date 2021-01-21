import React, { useState, useMemo } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import ContextNavigation from "./context";
import Login from "../principal/login";
import PrincipalScreens from "./stacknavigation";
import Register from '../principal/register';

const RootStack = createStackNavigator();
const Stack = createStackNavigator();
function Auth() {
    return (
        <Stack.Navigator headerMode="none">
            <Stack.Screen name="login" component={Login} headerMode="none" />
            <Stack.Screen name="Register" component={Register} headerMode="none" />
        </Stack.Navigator>
    )
}
function RootStackScreen({ user }) {
    return (
        <RootStack.Navigator headerMode="none">
            {
                user === null ? (
                    <RootStack.Screen name="Authe" component={Auth} headerMode="none" />
                ) : (
                        <RootStack.Screen name="App" component={PrincipalScreens} headerMode="none" />
                    )


            }
        </RootStack.Navigator>
    )
}

function IndexAppScreen() {
    const [user, setUser] = useState(null);
    const contextNavigation = useMemo(
        () => {
            return {
                login: () => {
                    setUser("1");
                },
                logout: () => {
                    setUser(null);
                }
            }
        }
    )

    return (
        <ContextNavigation.Provider value={contextNavigation}>
            <NavigationContainer>
                <RootStackScreen user={user} />
            </NavigationContainer>
        </ContextNavigation.Provider>
    )
}

export default IndexAppScreen;