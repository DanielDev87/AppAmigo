import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import { useState, createContext, useContext } from "react";
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/services/firebaseConfig";
import SplashScreen from "../src/screens/SplashScreen";
import RegisterScreen from "../src/screens/auth/RegisterScreen"
import LoginScreen from "../src/screens/auth/LoginScreen"
import SettingsScreen from "../src/screens/SettingsScreen";
import UserScreen from "../src/screens/UserScreen";
import HomeScreen from "../src/screens/HomeScreen";
import { onAuthStateChanged } from "firebase/auth";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Contexto de autenticación simple
const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const TabNavigator = () =>{
    const {user} = useAuth();

    return(
        <Tab.Navigator 
            initialRouteName="Home" 
            screenOptions={({route})=>({
                tabBarIcon: ({color, size, focused})=>{
                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if(route.name === "Settings"){
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else if(route.name === "User"){
                        iconName = focused ? 'person' : 'person-outline';
                    } 
                    
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#0077B6',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name ="Home" component={HomeScreen} options={{tabBarLabel:'Home'}}/>
            <Tab.Screen name ="User" component={UserScreen} options={{tabBarLabel:'Usuario'}}/>
            <Tab.Screen name ="Settings" component={SettingsScreen} options={{tabBarLabel:'Ajustes'}}/>
        </Tab.Navigator>
    )

}

const AuthNavigator = ()=>{
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Splash" component={SplashScreen}/>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
        </Stack.Navigator>
    )
}

const AppNavigator = ()=>{
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const authContextValue = {
        user,
        setUser,
        isLoading,
        setIsLoading
    };

    if (isLoading) {
        return <SplashScreen />;
    }

    return(
        <AuthContext.Provider value={authContextValue}>
            <Stack.Navigator initialRouteName="Splash">
                <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown: false}}/>
                <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}}/>
                <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
                <Stack.Screen name="Main" component={TabNavigator} options={{headerShown: false}}/>
            </Stack.Navigator>
        </AuthContext.Provider>
    )
}

export default AppNavigator;