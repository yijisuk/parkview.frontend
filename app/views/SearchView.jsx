import React from "react";
import { View } from "react-native";

import SpeechSearchView from "./search/SpeechSearchView";
import TextSearchView from "./search/TextSearchView";
import searchViewStyles from "../styles/viewStyles/searchViewStyles";

export default function SearchView({ route }) {
    const { type } = route?.params ?? {};

    return (
        <View style={searchViewStyles.container}>
            {type === "Speech" ? <SpeechSearchView /> : <TextSearchView />}
        </View>
    );
}
