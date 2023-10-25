import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import supabase from "../../config/supabase";


export default function SettingsView() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser(user);
            } else {
                Alert.alert("Error Accessing User Data");
            }
        });
    }, []);

    const doLogOut = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            Alert.alert("Error Signing Out User", error.message);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack.Screen options={{ headerShown: true, title: "Settings" }} />
            <ScrollView>
                <View style={styles.container}>
                    <Text>{JSON.stringify(user, null, 2)}</Text>
                    <TouchableOpacity
                        onPress={doLogOut}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
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
});