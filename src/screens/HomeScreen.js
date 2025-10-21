import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import colors from '../constants/colors'
import {useAuth} from '../../navigation/AuthContext'

const HomeScreen = () => {
  const {user} = useAuth();
  const displayName = user?.displayName || (user?.email ? user.email.split('@')[0]: 'Amigo');
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Pantalla del Home</Text>
        <Text style={styles.subtitle}>¡Bienvenido, {displayName}! </Text>
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

export default HomeScreen