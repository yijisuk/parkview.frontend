import { StyleSheet } from "react-native-web";
import { commonStyles, commonToolkit } from "../commonStyles";


const favoritesViewStyles = StyleSheet.create({
    container: {
        ...commonStyles.container,
        justifyContent: "center",
    },
    placeholderText: {
        ...commonStyles.text1,
        textAlign: "center",
    },
});

export default favoritesViewStyles;