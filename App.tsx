import { WebView } from "react-native-webview";
import * as SplashScreen from "expo-splash-screen";

const App = () => {
  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const delaySplash = async () => {
    await SplashScreen.preventAutoHideAsync();
    await sleep(2000);
    await SplashScreen.hideAsync();
  };

  delaySplash();

  return <WebView source={{ uri: "https://wagglewaggle.co.kr" }} />;
};

export default App;
