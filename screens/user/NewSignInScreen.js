import React, { useEffect, useState } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import { Formik, Field } from "formik";
import * as yup from "yup";

import { login } from "../../store/actions/signin";
import { facebookSignUp, googleSignUp } from "../../store/actions/signup";

import RippleEffectButton from "../../components/UI/RippleEffectButton";
import AuthenticateInput from "../../components/UI/AuthenticateInput";
import AuthenticateButton from "../../components/UI/AuthenticateButton";
import StartupScreen from "../StartupScreen";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const signInValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid email")
    .required("Email Address is required"),
  password: yup.string().required("Password is required"),
});

const NewSignInScreen = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  if (loading) {
    return <StartupScreen />;
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>Sign In</Text>
        <Formik
          validationSchema={signInValidationSchema}
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={async ({ email, password }) => {
            setLoading(true);
            try {
              await dispatch(
                login({
                  email: email,
                  password: password,
                })
              );
            } catch (error) {
              Alert.alert(
                "Login Failed",
                error.response.data.non_field_errors[0]
              );
            }
            setLoading(false);
          }}
        >
          {({ handleSubmit, isValid }) => (
            <View style={styles.formContainer}>
              <Field
                component={AuthenticateInput}
                name="email"
                title="Email"
                iconName="email"
                placeholder="Enter your email"
                keyboardType="email-address"
              />
              <Field
                component={AuthenticateInput}
                name="password"
                title="Password"
                iconName="lock"
                placeholder="Enter your password"
                secureTextEntry
                textContentType="password"
              />
              <RippleEffectButton
                title="Sign in"
                onButtonPress={handleSubmit}
                disabled={!isValid}
              />
              <TouchableOpacity onPress={() => props.navigation.navigate('Reset Password')}>
                <Text
                  style={{
                    textAlign: "center",
                    color: "#ff4848",
                    fontFamily: "AvertaStd-Semibold",
                  }}
                >
                  Forgot password?
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 30,
                  marginBottom: 20,
                }}
              >
                <View
                  style={{ flex: 1, height: 1, backgroundColor: "#708999" }}
                />
                <View>
                  <Text
                    style={{
                      width: 50,
                      textAlign: "center",
                      color: "#708999",
                      fontFamily: "AvertaStd-Regular",
                    }}
                  >
                    OR
                  </Text>
                </View>
                <View
                  style={{ flex: 1, height: 1, backgroundColor: "#708999" }}
                />
              </View>

              <AuthenticateButton
                title="Sign in with Google"
                iconName="google"
                onSocialButtonPress={async () => {
                  setLoading(true);
                  try {
                    await dispatch(googleSignUp());
                  } catch (error) {
                    Alert.alert("Google Login Failed");
                  }
                  setTimeout(() => {
                    setLoading(false);
                  }, 4000);
                }}
              />
              <AuthenticateButton
                title="Sign in with Facebook"
                iconName="facebook"
                onSocialButtonPress={async () => {
                  setLoading(true);
                  try {
                    await dispatch(facebookSignUp());
                  } catch (error) {
                    Alert.alert("Facebook Login Failed");
                  }
                  setTimeout(() => {
                    setLoading(false);
                  }, 5000);
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: SCREEN_HEIGHT / 20,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#708999", fontFamily: "AvertaStd-Regular" }}
                >
                  Don't have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate("Sign Up")}
                >
                  <Text
                    style={{
                      color: "#ff4848",
                      fontFamily: "AvertaStd-Semibold",
                      marginHorizontal: SCREEN_WIDTH / 30,
                    }}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  headerText: {
    textAlign: "center",
    fontFamily: "AvertaStd-Semibold",
    fontSize: 25,
    color: "#001b3a",
    paddingTop: SCREEN_HEIGHT / 10,
  },
  formContainer: {
    paddingHorizontal: SCREEN_WIDTH / 20,
  },
});

export default NewSignInScreen;
