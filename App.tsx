import { useEffect } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  Keyboard,
  Appearance,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";
import { AppWebView } from "./components";

const App = () => {
  const colorScheme = Appearance.getColorScheme();

  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const delaySplash = async () => {
    await SplashScreen.preventAutoHideAsync();
    await sleep(1000);
    await SplashScreen.hideAsync();
  };

  useEffect(() => {
    delaySplash();
  }, []);

  return (
    <NavigationContainer
      linking={{
        prefixes: [
          Linking.createURL("/"),
          "http://192.168.45:139:3000",
          "https://wagglewaggle.co.kr",
          "https://64044a7ddd3dac686e27999e--super-dodol-2a5183.netlify.app",
        ],
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
        }}
      >
        <StatusBar
          backgroundColor={colorScheme === "dark" ? "#000" : "#fff"}
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        />
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
          enabled={Platform.OS === "ios"}
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <AppWebView />
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
