import { useEffect, useRef } from "react";
import {
  BackHandler,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  Appearance,
  KeyboardAvoidingView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import * as SplashScreen from "expo-splash-screen";
import * as Location from "expo-location";
import * as Linking from "expo-linking";

const App = () => {
  const webViewRef = useRef<WebView>(null);
  const colorScheme = Appearance.getColorScheme();

  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const delaySplash = async () => {
    await SplashScreen.preventAutoHideAsync();
    await sleep(1000);
    await SplashScreen.hideAsync();
  };

  const onAndroidBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  };

  const getUserLocation = async () => {
    try {
      await Location.requestForegroundPermissionsAsync();
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      webViewRef.current?.postMessage(
        JSON.stringify({
          code: "success",
          latitude: latitude,
          longitude: longitude,
        })
      );
    } catch (e) {
      webViewRef.current?.postMessage(
        JSON.stringify({ code: "fail", errorMsg: "location permission denied" })
      );
    }
  };

  useEffect(() => {
    delaySplash();
  }, []);

  useEffect(() => {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
      return () =>
        BackHandler.removeEventListener(
          "hardwareBackPress",
          onAndroidBackPress
        );
    }
  }, []);

  return (
    <NavigationContainer
      linking={{
        prefixes: [
          Linking.createURL("/"),
          "https://wagglewaggle.co.kr",
          "https://64044a7ddd3dac686e27999e--super-dodol-2a5183.netlify.app",
        ],
      }}
      fallback={<Text>Loading...</Text>}
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
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <WebView
            ref={webViewRef}
            source={{ uri: "http://192.168.45.139:3000" }}
            onLoadEnd={getUserLocation}
            cacheEnabled
            javaScriptEnabled
            allowsBackForwardNavigationGestures
            bounces={false}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
