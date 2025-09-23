import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import colors from '../constants/colors'
import { useAuth } from '../../navigation/AppNavigator'

const UserScreen = ({navigation}) => {
  const {user} = useAuth();
  const [imageUri, setImageUri]= useState(null) 
  const defaultImage = //variable de entorno que nos llame a una imagen por defecto

  useEffect(()=>{
    if (user && user.{{//cuando la imagen esté configurada}}) {
      setImageUri(user.photoURL)
    } else {
      setImageUri(defaultImage)
    }
  })
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Perfil de Usuario</Text>
        <Text style={styles.subtitle}>Información del usuario</Text>
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
})

export default UserScreen