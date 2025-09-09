import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import colors from "../../constants/colors";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const LoginScreen =()=>{
    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');
    const [error, setError]= useState('');
    const [errorMessage, setErrorMessage]= useState('');

    return(
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Icon name="email-outline" size={24} style={{}}/>
            <TextInput style={{}} placeholder="Correo electrónico" placeholderTextColor={colors.thin}
            value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>

            <View style={styles.inputContainer}>
                <Icon name="lock-outline" size={24} style={{}}/>
            <TextInput style={{}} placeholder="Contraseña" placeholderTextColor={colors.thin}
            value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />
            </View>

            <TouchableOpacity style={{}} onPress={{}}>
                <Text>Registrarse</Text>
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    logo:{
        width: 120,
        height: 120
    }
})

export default LoginScreen;