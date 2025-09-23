import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import colors from '../constants/colors'
import { useNavigation } from '@react-navigation/native'
import { auth } from '../services/firebaseConfig'

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading]= useState(false);

  const handleLogout = async ()=>{
    try {
      setLoading(true);
      await signOut(auth);
      Alert.alert('Sesión cerrada', 'Has cerrado tu sesión correctamente', [
        {text: 'OK', onPress: ()=> navigation.reset({index: 0, routes: [{name: 'Login'}]})}
      ])
    } catch (error) {
      console.log("error al cerrar la sesión", error);
      Alert.alert('ERROR', 'No se pudo cerrar tu sesión, intentalo nuevamente')
      
    }finally{
      setLoading(false);
    }
  }
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Configuración</Text>
        <Text style={styles.subtitle}>Ajustes de la aplicación</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={loading} >
          {
            loading ?(
              <ActivityIndicator color={colors.luminous}/>
            ): (
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            )
          }
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.fondoClaro,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.principal,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.subtle,
  },
  logoutButton: {
    marginTop: 24,
    backgroundColor: colors.error,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: colors.luminous,
    fontSize: 16,
    fontWeight: '600',
  },
})

export default SettingsScreen