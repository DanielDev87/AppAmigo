import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import colors from './src/constants/colors';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hola compañeros del curso desarrollo Movil!</Text>
      <StatusBar style="auto" />
      <Image source={require('./assets/logo-funlam.png')} />
    </View>
  );
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
