import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import AppProvider from './navigation/AppProvider';


export default function App() {
  return (
    <AppProvider>
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
    </AppProvider>
  );
}

