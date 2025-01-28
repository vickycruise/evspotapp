import {
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import React, { useEffect, useState } from "react";

import { Colors } from "@/constants/Colors";
import Icon from "react-native-vector-icons/Ionicons";
import styles from "@/assets/styles";

const ProfileModal = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const [token, setToken] = useState("");

  const toggleModal = () => setModalVisible(!modalVisible);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "211050989236-83pm2hcol3lonjcdcqa0nrd2coems0rt.apps.googleusercontent.com",
    });
  }, [])

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("User Info:", userInfo);

      const idToken = userInfo.data?.idToken;
      if (idToken) setToken(idToken);
    } catch (error: any) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          Alert.alert("Cancelled", "User cancelled the login process.");
          break;
        case statusCodes.IN_PROGRESS:
          Alert.alert("In Progress", "Sign-in process is already in progress.");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          Alert.alert("Error", "Google Play Services is not available.");
          break;
        default:
          Alert.alert("Error", "An unknown error occurred.");
          console.error(error);
      }
    }
  };
  return (
    <View
      style={{
        marginTop: 50,
        marginRight: 20,
        backgroundColor: Colors.dark.background,
        padding: 10,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={toggleModal}>
        <Icon name="person-circle-outline" size={30} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: 300,
              alignItems: "center",
            }}
          >
            <Text style={{ marginBottom: 20 }}>Sign in with Google</Text>

            {
              <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={handleGoogleSignIn}
              />
            }

            {token && (
              <View style={{ marginTop: 20, alignItems: "center" }}>
                <Text style={{ marginTop: 10 }}>Welcome</Text>
              </View>
            )}

            <TouchableOpacity onPress={toggleModal} style={{ marginTop: 20 }}>
              <Text style={{ color: Colors.dark.background }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileModal;
