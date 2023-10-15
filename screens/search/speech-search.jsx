import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Audio } from "expo-av";


export function SpeechSearchView() {
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

        setTranscript("");
        setSoundUri(uri);
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
