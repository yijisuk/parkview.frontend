import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import Modal from "react-native-modal";
import PreferencesSetupView from "./settings/PreferencesSetupView";
import supabase from "../../config/supabase";


export default function SettingsView() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser(user);
                setEmail(user.email);
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
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.emailText}>Hi {email}</Text>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={styles.menuItem}
                    >
                        <Text style={styles.menuItemText}>Preferences</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={doLogOut} style={styles.button}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Modal
                isVisible={modalVisible}
                onBackdropPress={() => setModalVisible(false)} // Close the modal when the backdrop is pressed
                onSwipeComplete={() => setModalVisible(false)} // Optional: close the modal by swiping
                swipeDirection="left" // Optional: set the swipe direction
                style={styles.modal} // Custom styles for the modal
                animationIn="slideInRight" // Change the animation
                animationOut="slideOutRight" // Change the animation
            >
                <PreferencesSetupView />
                <TouchableOpacity
                    onPress={() => setModalVisible(!modalVisible)}
                    style={styles.closeModalButton}
                >
                    <Text style={styles.closeModalButtonText}>Close</Text>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        // styles for the container
        padding: 20,
    },
    emailText: {
        // styles for the email text
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },
    menuItem: {
        // styles for menu item
        backgroundColor: "#DDD",
        padding: 15,
        borderRadius: 5,
    },
    menuItemText: {
        // styles for menu item text
        fontSize: 18,
        textAlign: "center",
    },
    button: {
        // styles for logout button
        backgroundColor: "black",
        padding: 15,
        borderRadius: 5,
        marginTop: 15,
    },
    buttonText: {
        // styles for button text
        fontSize: 18,
        color: "white",
        textAlign: "center",
    },
    closeModalButton: {
        // styles for close modal button
        marginTop: 15,
        backgroundColor: "black",
        padding: 30,
        borderRadius: 5,
    },
    closeModalButtonText: {
        // styles for close modal button text
        fontSize: 18,
        color: "white",
        textAlign: "center",
    },
    modal: {
        // custom styles for modal
        margin: 0, // This is important to ensure the modal shows up from the side
        justifyContent: "flex-end", // Align to the bottom of the screen
    },
});
