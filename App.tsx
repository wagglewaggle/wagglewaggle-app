import { useEffect, useRef } from "react";
import { BackHandler, Platform, SafeAreaView, Appearance } from "react-native";
import { WebView } from "react-native-webview";
import * as SplashScreen from "expo-splash-screen";
import * as Location from "expo-location";

const App = () => {
  const webViewRef = useRef<WebView>(null);
  const SAFE_AREA_BACKGROUND_COLOR =
    Appearance.getColorScheme() === "dark" ? "#000" : "#fff";

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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: SAFE_AREA_BACKGROUND_COLOR }}
    >
      <WebView
        ref={webViewRef}
        source={{ uri: "http://192.168.45.139:3000" }}
        onLoadEnd={getUserLocation}
        cacheEnabled
        javaScriptEnabled
        allowsBackForwardNavigationGestures
      />
    </SafeAreaView>
  );
};

export default App;
