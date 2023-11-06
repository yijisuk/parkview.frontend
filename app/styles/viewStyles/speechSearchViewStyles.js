import { StyleSheet } from "react-native";
import { commonStyles, commonToolkit } from "../commonStyles";

const speechSearchViewStyles = StyleSheet.create({
    container: {
        ...commonStyles.container,
        padding: 20,
        justifyContent: "center",
    },
    textInput: {
        borderWidth: 1,
        borderColor: commonToolkit.autoFieldElemColor,
        padding: 10,
        marginBottom: 20,
    },
    speechSearchButton: {
        ...commonStyles.mainButton,
        padding: 20
    },
});

export default speechSearchViewStyles;
