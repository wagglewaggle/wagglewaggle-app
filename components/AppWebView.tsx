import { useCallback, useEffect, useRef } from "react";
import { BackHandler, Platform } from "react-native";
import { WebView } from "react-native-webview";
// import * as Location from "expo-location";
import * as Linking from "expo-linking";

const AppWebView = () => {
  const webViewRef = useRef<WebView>(null);

  // 유저 위치 정보는 관련 기능 구현 후 다시 구현될 예정
  // const getUserLocation = async () => {
  //   try {
  //     await Location.requestForegroundPermissionsAsync();
  //     const {
  //       coords: { latitude, longitude },
  //     } = await Location.getCurrentPositionAsync();
  //     webViewRef.current?.postMessage(
  //       JSON.stringify({
  //         code: "success",
  //         latitude: latitude,
  //         longitude: longitude,
  //       })
  //     );
  //   } catch (e) {
  //     webViewRef.current?.postMessage(
  //       JSON.stringify({ code: "fail", errorMsg: "location permission denied" })
  //     );
  //   }
  // };

  const onAndroidBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  };

  const sendInitialUrl = useCallback(async () => {
    const initialUrl = await Linking.getInitialURL();
    if (!webViewRef.current || !initialUrl) return;
    webViewRef.current.postMessage(initialUrl);
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
      style={{ flex: 1 }}
      source={{ uri: "https://wagglewaggle.co.kr" }}
      onLoadEnd={sendInitialUrl}
      cacheEnabled
      javaScriptEnabled
      allowsBackForwardNavigationGestures
      bounces={false}
      scalesPageToFit={false}
      scrollEnabled={false}
    />
  );
};

export default AppWebView;
