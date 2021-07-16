import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { SafeAreaView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const Scanner = ({ type, data }) => {
    setScanned(true);
    apiConsult(data);
  };

  let apiConsult = async (data) => {
    console.log(data);
    url = "http://26ca6770d402.ngrok.io/productos"
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: data,
    };

    await fetch(url, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        //this.setState({ errorMessage: error.toString() });
        console.log(error)
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : Scanner}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      {scanned && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setScanned(false)}
        >
          <FontAwesome name="camera" size={23} color="#FFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    margin: 30,
    borderRadius: 10,
    height: 50,
  },
});
