import React from "react";
import { View, Text } from "react-native";

import SpeechSearchView from "./search/SpeechSearchView";
import TextSearchView from "./search/TextSearchView";


export default function SearchView({ route }) {
    const { type } = route?.params ?? {};

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            {type === "Speech" ? <SpeechSearchView /> : <TextSearchView />}
        </View>
    );
}
