import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import colors from '../constants/colors'

const HomeScreen = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Pantalla del Home</Text>
        <Text style={styles.subtitle}>¡Bienvenido a AppAmigo!</Text>
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