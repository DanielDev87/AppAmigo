import { LinearGradient } from "expo-linear-gradient";
import { Text, Image, StyleSheet } from "react-native"
import colors from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

const SplashScreen =()=> {
    const navigation = useNavigation();

    useEffect(()=>{
        navigation.serTimeout(()=>{
            navigation.replace('Register')
        },3000);
        return ()=> clearTimeout(timer);
    }, [navigation]);

    return(
        <LinearGradient colors={colors.gradientePrimario} style={styles.container}>
            <Text style={styles.text}>Loading...</Text>
            <Image source={require('../../assets/splash-icon.png')} style={styles.logo} />
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        color: colors.luminous,
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
});

export default SplashScreen;