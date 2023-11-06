import React, { useEffect, useState } from "react";
import {
    ScrollView,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Alert,
} from "react-native";
import { commonStyles } from "../styles/commonStyles";
import settingsViewStyles from "../styles/viewStyles/settingsViewStyles";

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
        <SafeAreaView style={commonStyles.container}>
            <ScrollView>
                <View style={settingsViewStyles.container}>
                    <Text style={commonStyles.headerFieldText}>Hi {email}</Text>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={settingsViewStyles.button}
                    >
                        <Text style={commonStyles.buttonText1}>
                            Preferences
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={doLogOut}
                        style={settingsViewStyles.button}
                    >
                        <Text style={commonStyles.buttonText1}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Modal
                isVisible={modalVisible}
                onBackdropPress={() => setModalVisible(false)} // Close the modal when the backdrop is pressed
                onSwipeComplete={() => setModalVisible(false)} // Optional: close the modal by swiping
                swipeDirection="left" // Optional: set the swipe direction
                style={settingsViewStyles.modal} // Custom styles for the modal
                animationIn="slideInRight" // Change the animation
                animationOut="slideOutRight" // Change the animation
            >
                <PreferencesSetupView />
                <TouchableOpacity
                    onPress={() => setModalVisible(!modalVisible)}
                    style={settingsViewStyles.closeModalButton}
                >
                    <Text style={commonStyles.buttonText2}>Close</Text>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}
