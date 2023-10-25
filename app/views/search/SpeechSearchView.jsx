import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";

import supabase from "../../../config/supabase.js";
import { PARKVIEW_STORAGE_BUCKET } from "@env";

export default function SpeechSearchView() {
    const [transcript, setTranscript] = useState("");
    const [recording, setRecording] = useState(false);
    const [soundUri, setSoundUri] = useState(null);
    const recordingInstance = useRef(null);

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

            setTranscript("Recording started");
        } catch (err) {
            console.error("Failed to start recording", err);
        }
    }

    async function stopRecording() {
        setTranscript("Stopping recording..");

        setRecording(undefined);
        await recordingInstance.current.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        const uri = recordingInstance.current.getURI();
        console.log("Recording stopped and stored at", uri);

        await uploadAudio(uri);

        setTranscript("");
        setSoundUri(uri);
    }

    async function uploadAudio(uri, contentType = "audio/m4a") {
        try {
            const base64FileData = await readAudioFileAsBase64(uri);
            if (!base64FileData) {
                console.error("Could not read base64 data from file");
                return;
            }

            const buffer = Buffer.from(base64FileData, "base64");

            const id = Math.random().toString(36).substring(2);
            const filePath = `temp/demo-audio-${id}.m4a`;

            const { data, error } = await supabase.storage
                .from(PARKVIEW_STORAGE_BUCKET)
                .upload(filePath, buffer, {
                    contentType,
                    upsert: true,
                });

            if (error) {
                console.error("Error uploading audio:", error);
            } else {
                console.log("Successfully uploaded audio:", data);
            }
        } catch (error) {
            console.error("An error occurred:", error);
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
        <View style={styles.container}>
            <TextInput
                value={transcript}
                editable={false}
                placeholder="Tap button to start recording"
                style={styles.textInput}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={recording ? stopRecording : startRecording}
            >
                <Text style={styles.buttonText}>
                    {recording ? "Stop Recording" : "Start Recording"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: "center",
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#2196F3",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
    },
});
