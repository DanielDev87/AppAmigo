import { View } from "react-native"

const SplashScreen =()=> {
    return(
        <View>
            <Text>Loading...</Text>
            <Image source={require('../../assets/splash-icon.png')} />
        </View>
    )
}