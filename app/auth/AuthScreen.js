import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    Keyboard,
} from "react-native";
import supabase from "../../config/supabase.js";
import { ASSETS_TEMP_LOGO_URI } from "@env";


export default function AuthScreen() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const testEmail = "test@user.com";
    const testPassword = "password";

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: testPassword,
        });

        if (error) Alert.alert("Sign In Error", error.message);
        setLoading(false);
    }

    async function signUpWithEmail() {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) Alert.alert("Sign Up Error", error.message);
        if (!session)
            Alert.alert("Please check your inbox for email verification!");
        setLoading(false);
    }

    return (
        <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[styles.container]}>
                    <View style={styles.logoContainer}>
                        <Image
                            style={styles.logo}
                            source={{
                                uri: ASSETS_TEMP_LOGO_URI,
                            }}
                        />
                    </View>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ flex: 1 }}
                    >
                        <View>
                            <View style={[styles.verticallySpaced, styles.mt20]}>
                                <TextInput
                                    style={styles.input}
                                    label="Email"
                                    onChangeText={(text) => setEmail(text)}
                                    value={email}
                                    placeholder="email@address.com"
                                    autoCapitalize={"none"}
                                />
                            </View>
                            <View style={styles.verticallySpaced}>
                                <TextInput
                                    style={styles.input}
                                    label="Password"
                                    onChangeText={(text) => setPassword(text)}
                                    value={password}
                                    secureTextEntry={true}
                                    placeholder="Password"
                                    autoCapitalize={"none"}
                                />
                            </View>
                            <View style={[styles.verticallySpaced, styles.mt20]}>
                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={() => signInWithEmail()}
                                    style={styles.button}
                                >
                                    <Text style={styles.buttonText}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.verticallySpaced}>
                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={() => signUpWithEmail()}
                                    style={styles.button}
                                >
                                    <Text style={styles.buttonText}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        padding: 12,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: "stretch",
    },
    mt20: {
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 4,
        padding: 8,
    },
    button: {
        backgroundColor: "black",
        padding: 12,
        borderRadius: 4,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    logo: {
        width: 200,
        height: 200,
    },
});