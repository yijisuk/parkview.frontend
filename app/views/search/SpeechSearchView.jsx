import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
} from "react-native";
import speechSearchViewStyles from "../../styles/viewStyles/speechSearchViewStyles";

import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

import supabase from "../../../config/supabase.js";
import { PARKVIEW_STORAGE_BUCKET, BACKEND_ADDRESS } from "@env";
import { commonStyles } from "../../styles/commonStyles.js";


export default function SpeechSearchView() {
    const navigation = useNavigation();

    const [recording, setRecording] = useState(false);
    const [user, setUser] = useState(null);
    const [destinationAddress, setDestinationAddress] = useState(null);
    const recordingInstance = useRef(null);

    // Initial load for user information
    useEffect(() => {
        supabase.auth
            .getUser()
            .then(({ data: { user } }) => {
                if (user) {
                    setUser(user);
                } else {
                    // Alert.alert("Error Accessing User Data");
                }
            })
            .catch((error) => console.log(error));
    });

    useEffect(() => {
        if (
            destinationAddress !== null &&
            typeof destinationAddress !== "undefined"
        ) {
            // Show alert to the user
            Alert.alert(
                "Proceed to Navigation",
                `${destinationAddress}`,
                [
                    {
                        text: "No",
                        onPress: () => {
                            console.log("User cancelled navigation");
                            setDestinationAddress(null);
                        },
                        style: "cancel",
                    },
                    {
                        text: "Yes",
                        onPress: () => {
                            navigation.navigate("Navigation", {
                                destinationAddress: destinationAddress,
                            });
                            setDestinationAddress(null);
                        },
                    },
                ],
                { cancelable: false }
            );
        }
    }, [destinationAddress, navigation]);

    async function startRecording() {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            recordingInstance.current = recording;
            setRecording(recording);

        } catch (err) {
            console.error("Failed to start recording", err);
        }
    }

    async function handleRecordedFile() {

        setRecording(undefined);
        await recordingInstance.current.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        const uri = recordingInstance.current.getURI();
        console.log("Recording stopped and stored at", uri);

        await processAudioToDestination(uri);
    }

    async function processAudioToDestination(uri, contentType = "audio/m4a") {
        try {
            // upload Audio to Supabase
            const base64FileData = await readAudioFileAsBase64(uri);
            if (!base64FileData) {
                console.error("Could not read base64 data from file");
                return;
            }

            const buffer = Buffer.from(base64FileData, "base64");

            const uid = user.identities[0].id;
            const id = Math.random().toString(36).substring(2);

            const filePath = `${uid}/rec-${id}.m4a`;
            const audioFileName = `rec-${id}.m4a`;

            const { data, error } = await supabase.storage
                .from(PARKVIEW_STORAGE_BUCKET)
                .upload(filePath, buffer, {
                    contentType,
                    upsert: true,
                });

            if (error) {
                console.error("Error uploading audio: ", error.message);
            } else {
                console.log("Successfully uploaded audio: ", data);
            }

            // send process Audio request to backend
            axios
                .get(
                    `${BACKEND_ADDRESS}/processVoiceQuery?uid=${uid}&audioFileName=${audioFileName}`
                )
                .then((res) => {
                    setDestinationAddress(res.data.destination);
                })
                .catch((error) => {
                    console.log(
                        "Error processing audio on backend: ",
                        error.message
                    );
                });
        } catch (error) {
            console.error("An error occurred:", error.message);
        }
    }

    async function readAudioFileAsBase64(uri) {
        try {
            const base64String = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return base64String;
        } catch (error) {
            console.error("Failed to read audio file", error);
            return null;
        }
    }

    return (
        <View style={speechSearchViewStyles.container}>
            <TouchableOpacity
                style={speechSearchViewStyles.speechSearchButton}
                onPress={recording ? handleRecordedFile : startRecording}
            >
                <Text style={commonStyles.buttonText3}>
                    {recording ? "Stop Recording" : "Start Recording"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
