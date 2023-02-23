import { useEffect, useRef } from "react";
import { BackHandler, Platform } from "react-native";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";

const App = () => {
  const webViewRef = useRef<WebView>(null);

  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const delaySplash = async () => {
    await SplashScreen.preventAutoHideAsync();
    await sleep(2000);
    await SplashScreen.hideAsync();
  };

  const onAndroidBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
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
    <WebView
      ref={webViewRef}
      allowsBackForwardNavigationGestures
      source={{ uri: "https://wagglewaggle.co.kr" }}
      style={{ marginTop: Constants.statusBarHeight }}
    />
  );
};

export default App;
