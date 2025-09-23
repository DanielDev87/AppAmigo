import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View, Text, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import colors from "../../constants/colors";

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();

    const handleRegister = () => {
        if (!name || !email || !password || !confirmPassword) {
            setError('Todos los campos son obligatorios');
            return;
        }
        
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: name
            });
            Alert.alert('Éxito', 'Usuario registrado correctamente', [
                { text: 'OK', onPress: () => navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                }) }
            ]);
            
        } catch (error) {
            onsole.error('=== ERROR DE REGISTRO ===');
            console.error('Código de error:', error.code);
            console.error('Mensaje de error:', error.message);
            console.error('Error completo:', error);
            console.error('========================');

            let errorMessage = 'Error al registrar usuario';

             switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Ya existe una cuenta con este correo electrónico';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'El formato del correo electrónico no es válido';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'La contraseña es muy débil';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'El registro no está habilitado en Firebase Console';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Error de conexión. Verifica tu internet y configuración de Firebase';
                    break;
                case 'auth/invalid-api-key':
                    errorMessage = 'API Key de Firebase inválida. Verifica tu configuración';
                    break;
                case 'auth/project-not-found':
                    errorMessage = 'Proyecto de Firebase no encontrado. Verifica tu Project ID';
                    break;
                case 'auth/configuration-not-found':
                    errorMessage = 'Configuración de Firebase no encontrada';
                    break;
                default:
                    errorMessage = `${error.message || 'Error desconocido'} (Código: ${error.code})`;
            }
            setError(errorMessage);   
        }
    };

    return (
        <LinearGradient colors={colors.gradientePrimario} style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Registro</Text>
                
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={24} color={colors.luminous} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Nombre completo" 
                        placeholderTextColor={colors.thin}
                        value={name} 
                        onChangeText={setName} 
                        autoCapitalize="words" 
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={24} color={colors.luminous} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Correo electrónico" 
                        placeholderTextColor={colors.thin}
                        value={email} 
                        onChangeText={setEmail} 
                        keyboardType="email-address" 
                        autoCapitalize="none" 
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={24} color={colors.luminous} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Contraseña" 
                        placeholderTextColor={colors.thin}
                        value={password} 
                        onChangeText={setPassword} 
                        secureTextEntry 
                        autoCapitalize="none" 
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={24} color={colors.luminous} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Confirmar contraseña" 
                        placeholderTextColor={colors.thin}
                        value={confirmPassword} 
                        onChangeText={setConfirmPassword} 
                        secureTextEntry 
                        autoCapitalize="none" 
                    />
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Registrarse</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.luminous,
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        width: '100%',
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 10,
        color: colors.luminous,
        fontSize: 16,
    },
    registerButton: {
        backgroundColor: colors.variante8,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: colors.luminous,
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkText: {
        color: colors.luminous,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default RegisterScreen;

